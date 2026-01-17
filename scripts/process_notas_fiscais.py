"""
Script principal orquestrador do processamento de notas fiscais
Executa todos os passos do pipeline
"""

import sys
import time
from pathlib import Path
import json
import pandas as pd

# Importar outros scripts
from extract_invoice_data import InvoiceExtractor
from categorize_items import processar_categorizacao
from detect_duplicates import processar_deteccao_duplicatas
from reconcile_spreadsheet import processar_reconciliacao

def verificar_dependencias():
    """Verifica se todas as dependências estão instaladas"""
    print("Verificando dependências...")

    dependencias = {
        'pdfplumber': 'pdfplumber',
        'pytesseract': 'pytesseract',
        'pandas': 'pandas',
        'openpyxl': 'openpyxl',
        'PIL': 'Pillow'
    }

    faltando = []

    for modulo, pacote in dependencias.items():
        try:
            __import__(modulo)
            print(f"  ✓ {pacote}")
        except ImportError:
            print(f"  ✗ {pacote} - FALTANDO")
            faltando.append(pacote)

    if faltando:
        print(f"\nERRO: Instale as dependências faltantes:")
        print(f"pip install {' '.join(faltando)}")
        return False

    # Verificar Tesseract OCR
    try:
        import pytesseract
        pytesseract.get_tesseract_version()
        print(f"  ✓ Tesseract OCR")
    except:
        print(f"  ✗ Tesseract OCR - FALTANDO")
        print("\nERRO: Instale o Tesseract OCR de:")
        print("https://github.com/UB-Mannheim/tesseract/wiki")
        return False

    print("Todas as dependências estão OK!\n")
    return True

def verificar_arquivos():
    """Verifica se os arquivos de entrada existem"""
    print("Verificando arquivos de entrada...")

    arquivos = {
        'PDF de Notas': 'Notas Flame.pdf',
        'Planilha de Gastos': 'Gastos_Consolidados_Flame_AUDITORIA.xlsx'
    }

    faltando = []

    for nome, arquivo in arquivos.items():
        if Path(arquivo).exists():
            tamanho = Path(arquivo).stat().st_size / 1024 / 1024
            print(f"  ✓ {nome}: {arquivo} ({tamanho:.1f} MB)")
        else:
            print(f"  ✗ {nome}: {arquivo} - NÃO ENCONTRADO")
            faltando.append(arquivo)

    if faltando:
        print(f"\nERRO: Arquivos faltando: {', '.join(faltando)}")
        return False

    print("Todos os arquivos de entrada estão OK!\n")
    return True

def criar_estrutura_diretorios():
    """Cria estrutura de diretórios de saída"""
    diretorios = [
        'output',
        'output/notas_baixa_qualidade'
    ]

    for diretorio in diretorios:
        Path(diretorio).mkdir(exist_ok=True, parents=True)

def gerar_relatorio_final(output_dir):
    """Gera relatório final consolidado"""
    print("\n=== GERANDO RELATÓRIO FINAL ===")

    relatorio_path = output_dir / 'relatorio_auditoria.txt'

    with open(relatorio_path, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("RELATÓRIO DE AUDITORIA - GASTOS FLAME LOUNGE\n")
        f.write("=" * 80 + "\n\n")

        f.write(f"Data da Auditoria: {time.strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        # Carregar estatísticas dos JSONs
        try:
            with open(output_dir / 'notas_extraidas_parsed.json', 'r', encoding='utf-8') as jf:
                notas = json.load(jf)
                f.write(f"Total de páginas processadas do PDF: {len(notas)}\n")

            with open(output_dir / 'relatorio_duplicatas.json', 'r', encoding='utf-8') as jf:
                dup = json.load(jf)
                stats = dup['estatisticas']

                f.write(f"\n--- ESTATÍSTICAS GERAIS ---\n")
                f.write(f"Linhas na planilha original: {stats['total_linhas_planilha']}\n")
                f.write(f"Notas no PDF: {stats['total_notas_pdf']}\n")
                f.write(f"Duplicatas encontradas na planilha: {stats['duplicatas_na_planilha']}\n")
                f.write(f"Duplicatas encontradas no PDF: {stats['duplicatas_no_pdf']}\n")
                f.write(f"Itens escritos à mão (suspeitos): {stats['itens_escritos_mao']}\n")
                f.write(f"Overlaps (em ambos): {stats['overlaps']}\n")
                f.write(f"Itens do PDF que faltavam na planilha: {stats['itens_faltantes_na_planilha']}\n")

            # Carregar planilha final
            df_final = pd.read_excel('Gastos_Consolidados_Flame_AUDITORIA.xlsx')

            f.write(f"\n--- PLANILHA FINAL ---\n")
            f.write(f"Total de linhas: {len(df_final)}\n")
            f.write(f"Valor total: R$ {df_final['VLR_TOTAL'].sum():,.2f}\n")

            f.write(f"\n--- DISTRIBUIÇÃO POR ORIGEM ---\n")
            origem_counts = df_final['ORIGEM_DADO'].value_counts()
            for origem, count in origem_counts.items():
                f.write(f"  {origem}: {count} linhas\n")

            f.write(f"\n--- DISTRIBUIÇÃO POR CATEGORIA ---\n")
            categoria_counts = df_final.groupby('CATEGORIA')['VLR_TOTAL'].agg(['count', 'sum'])
            for categoria, row in categoria_counts.iterrows():
                f.write(f"  {categoria}: {row['count']} itens (R$ {row['sum']:,.2f})\n")

            f.write(f"\n--- ITENS PARA REVISÃO MANUAL ---\n")
            itens_revisao = df_final[df_final['POSSIVEL_DUPLICATA'] == True]
            f.write(f"Total: {len(itens_revisao)} itens\n")
            if len(itens_revisao) > 0:
                f.write("\nPrimeiros 20 itens:\n")
                for idx, row in itens_revisao.head(20).iterrows():
                    f.write(f"  - {row['ITEM']} | {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']}\n")

            f.write(f"\n--- STATUS DE VERIFICAÇÃO ---\n")
            status_counts = df_final['STATUS_VERIFICACAO'].value_counts()
            for status, count in status_counts.items():
                f.write(f"  {status}: {count} linhas\n")

            f.write("\n" + "=" * 80 + "\n")
            f.write("FIM DO RELATÓRIO\n")
            f.write("=" * 80 + "\n")

            print(f"Relatório salvo em {relatorio_path}")

        except Exception as e:
            print(f"Erro ao gerar relatório final: {e}")

def gerar_planilhas_auxiliares(output_dir):
    """Gera planilhas auxiliares para revisão"""
    print("\n=== GERANDO PLANILHAS AUXILIARES ===")

    try:
        # Carregar planilha final
        df = pd.read_excel('Gastos_Consolidados_Flame_AUDITORIA.xlsx')

        # Planilha de itens para revisão
        itens_revisao = df[df['POSSIVEL_DUPLICATA'] == True]
        if len(itens_revisao) > 0:
            itens_revisao.to_excel(output_dir / 'itens_para_revisao.xlsx', index=False)
            print(f"✓ itens_para_revisao.xlsx ({len(itens_revisao)} itens)")

        # Planilha de itens sem nota fiscal
        itens_sem_nota = df[df['TIPO_ALERTA'].str.contains('ALERTA_SEM_NOTA_FISCAL', na=False)]
        if len(itens_sem_nota) > 0:
            itens_sem_nota.to_excel(output_dir / 'itens_sem_nota_fiscal.xlsx', index=False)
            print(f"✓ itens_sem_nota_fiscal.xlsx ({len(itens_sem_nota)} itens)")

        # Planilha de novos itens do PDF
        itens_novos = df[df['ORIGEM_DADO'] == 'PDF']
        if len(itens_novos) > 0:
            itens_novos.to_excel(output_dir / 'notas_nao_encontradas_planilha.xlsx', index=False)
            print(f"✓ notas_nao_encontradas_planilha.xlsx ({len(itens_novos)} itens)")

    except Exception as e:
        print(f"Erro ao gerar planilhas auxiliares: {e}")

def main():
    print("=" * 80)
    print("PROCESSAMENTO DE NOTAS FISCAIS - FLAME LOUNGE")
    print("=" * 80)
    print()

    inicio = time.time()

    # Fase 1: Verificações
    if not verificar_dependencias():
        return

    if not verificar_arquivos():
        return

    criar_estrutura_diretorios()

    # Fase 2: Extração OCR
    print("\n" + "=" * 80)
    print("FASE 1: EXTRAÇÃO DE DADOS DO PDF (OCR)")
    print("=" * 80 + "\n")

    pdf_path = "Notas Flame.pdf"
    extractor = InvoiceExtractor(pdf_path)
    extractor.process_all_pages()
    extractor.save_final_results()

    # Fase 3: Categorização
    print("\n" + "=" * 80)
    print("FASE 2: CATEGORIZAÇÃO DE ITENS")
    print("=" * 80 + "\n")

    processar_categorizacao(
        Path('output/notas_extraidas_parsed.json'),
        Path('output/notas_categorizadas.json')
    )

    # Fase 4: Detecção de Duplicidades
    print("\n" + "=" * 80)
    print("FASE 3: DETECÇÃO DE DUPLICIDADES")
    print("=" * 80 + "\n")

    processar_deteccao_duplicatas(
        'Gastos_Consolidados_Flame_AUDITORIA.xlsx',
        Path('output/notas_categorizadas.json'),
        Path('output/relatorio_duplicatas.json')
    )

    # Fase 5: Reconciliação
    print("\n" + "=" * 80)
    print("FASE 4: RECONCILIAÇÃO E ATUALIZAÇÃO DA PLANILHA")
    print("=" * 80 + "\n")

    processar_reconciliacao(
        'Gastos_Consolidados_Flame_AUDITORIA.xlsx',
        Path('output/notas_categorizadas.json'),
        Path('output/relatorio_duplicatas.json'),
        'Gastos_Consolidados_Flame_AUDITORIA.xlsx'
    )

    # Fase 6: Relatórios Finais
    output_dir = Path('output')
    gerar_relatorio_final(output_dir)
    gerar_planilhas_auxiliares(output_dir)

    # Resumo Final
    duracao = time.time() - inicio
    minutos = int(duracao // 60)
    segundos = int(duracao % 60)

    print("\n" + "=" * 80)
    print("PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
    print("=" * 80)
    print(f"\nTempo total: {minutos}min {segundos}s")
    print(f"\nArquivos gerados:")
    print(f"  - Gastos_Consolidados_Flame_AUDITORIA.xlsx (planilha atualizada)")
    print(f"  - output/relatorio_auditoria.txt")
    print(f"  - output/itens_para_revisao.xlsx")
    print(f"  - output/itens_sem_nota_fiscal.xlsx")
    print(f"  - output/notas_nao_encontradas_planilha.xlsx")
    print(f"  - output/notas_extraidas_raw.json")
    print(f"  - output/notas_extraidas_parsed.json")
    print(f"  - output/notas_categorizadas.json")
    print(f"  - output/relatorio_duplicatas.json")
    print("\n" + "=" * 80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nProcessamento interrompido pelo usuário.")
    except Exception as e:
        print(f"\n\nERRO FATAL: {e}")
        import traceback
        traceback.print_exc()
