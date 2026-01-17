"""
Script para reconciliar dados extraídos do PDF com a planilha Excel
Compara, adiciona itens faltantes, remove duplicatas, completa dados
"""

import pandas as pd
import json
from pathlib import Path
import re
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor para comparação"""
    if not fornecedor or pd.isna(fornecedor):
        return ""
    fornecedor = str(fornecedor).upper().strip()
    # Remover pontuação especial
    fornecedor = re.sub(r'[^\w\s]', '', fornecedor)
    # Remover palavras comuns
    palavras_remover = ['LTDA', 'ME', 'EIRELI', 'SA', 'S/A', 'EPP', 'CIA']
    for palavra in palavras_remover:
        fornecedor = fornecedor.replace(palavra, '')
    return ' '.join(fornecedor.split())

def normalizar_data(data):
    """Normaliza data para comparação"""
    if not data or pd.isna(data) or data == '' or data == '-':
        return None
    data_str = str(data).strip()
    # Tentar extrair DD/MM/YYYY
    match = re.search(r'(\d{2})[/-](\d{2})[/-](\d{4})', data_str)
    if match:
        return f"{match.group(1)}/{match.group(2)}/{match.group(3)}"
    return None

def normalizar_valor(valor):
    """Normaliza valor para comparação"""
    try:
        if pd.isna(valor) or valor == '' or valor is None:
            return 0.0
        return round(float(valor), 2)
    except:
        return 0.0

def criar_chave_comparacao(fornecedor, data, valor):
    """Cria chave para comparar itens"""
    fornecedor_norm = normalizar_fornecedor(fornecedor)
    data_norm = normalizar_data(data)
    valor_norm = normalizar_valor(valor)

    if not fornecedor_norm and not data_norm:
        return None

    return f"{fornecedor_norm}|{data_norm}|{valor_norm:.2f}"

def main():
    print("="*60)
    print("RECONCILIACAO: PDF vs PLANILHA EXCEL")
    print("="*60 + "\n")

    # Carregar planilha Excel
    print("Carregando planilha Excel...")
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"
    df_excel = pd.read_excel(planilha_path)
    print(f"[OK] {len(df_excel)} linhas na planilha original")
    print(f"[OK] Valor total planilha: R$ {df_excel['VLR_TOTAL'].sum():,.2f}\n")

    # Carregar dados extraídos do PDF
    print("Carregando dados extraídos do PDF...")
    with open('output/notas_extraidas_parsed.json', 'r', encoding='utf-8') as f:
        notas_pdf = json.load(f)
    print(f"[OK] {len(notas_pdf)} páginas processadas do PDF\n")

    # Estatísticas dos dados do PDF
    notas_com_valor = [n for n in notas_pdf if n.get('valor_total')]
    valor_total_pdf = sum(n['valor_total'] for n in notas_com_valor)
    print(f"[INFO] {len(notas_com_valor)} notas com valor extraído")
    print(f"[INFO] Valor total extraído do PDF: R$ {valor_total_pdf:,.2f}\n")

    # Criar mapa de itens da planilha
    print("Analisando planilha existente...")
    itens_planilha = {}
    for idx, row in df_excel.iterrows():
        chave = criar_chave_comparacao(
            row.get('FORNECEDOR'),
            row.get('DATA_ORIGINAL'),
            row.get('VLR_TOTAL')
        )
        if chave:
            if chave not in itens_planilha:
                itens_planilha[chave] = []
            itens_planilha[chave].append({
                'index': idx,
                'row': row.to_dict()
            })

    print(f"[OK] {len(itens_planilha)} chaves únicas na planilha\n")

    # Criar mapa de notas do PDF
    print("Analisando notas do PDF...")
    notas_por_chave = {}
    for nota in notas_pdf:
        chave = criar_chave_comparacao(
            nota.get('fornecedor'),
            nota.get('data'),
            nota.get('valor_total')
        )
        if chave:
            if chave not in notas_por_chave:
                notas_por_chave[chave] = []
            notas_por_chave[chave].append(nota)

    print(f"[OK] {len(notas_por_chave)} chaves únicas no PDF\n")

    # Encontrar correspondências e divergências
    print("="*60)
    print("COMPARACAO")
    print("="*60 + "\n")

    # Notas do PDF que estão na planilha
    em_ambos = set(notas_por_chave.keys()) & set(itens_planilha.keys())
    print(f"[OK] {len(em_ambos)} itens encontrados em ambos (PDF e Planilha)")

    # Notas do PDF que NÃO estão na planilha
    so_no_pdf = set(notas_por_chave.keys()) - set(itens_planilha.keys())
    print(f"[!] {len(so_no_pdf)} itens encontrados APENAS no PDF (faltando na planilha)")

    # Itens da planilha que NÃO estão no PDF
    so_na_planilha = set(itens_planilha.keys()) - set(notas_por_chave.keys())
    print(f"[!] {len(so_na_planilha)} itens da planilha NAO encontrados no PDF\n")

    # Calcular valor dos itens faltantes
    valor_faltante = 0.0
    for chave in so_no_pdf:
        for nota in notas_por_chave[chave]:
            if nota.get('valor_total'):
                valor_faltante += nota['valor_total']

    print(f"[INFO] Valor total dos itens faltantes: R$ {valor_faltante:,.2f}\n")

    # Preparar DataFrame para itens novos
    novos_itens = []

    print("="*60)
    print("ADICIONANDO ITENS FALTANTES")
    print("="*60 + "\n")

    for chave in so_no_pdf:
        for nota in notas_por_chave[chave]:
            # Criar nova linha baseada na nota do PDF
            novo_item = {
                'CATEGORIA': 'A CATEGORIZAR',  # Será categorizado depois
                'FORNECEDOR': nota.get('fornecedor', 'Fornecedor'),
                'ITEM': f"Item da nota fiscal pag. {nota['pagina_pdf']}",
                'QTD': 1,
                'VLR_UNIT': nota.get('valor_total', 0.0),
                'VLR_TOTAL': nota.get('valor_total', 0.0),
                'DATA_ORIGINAL': nota.get('data', ''),
                'OBS_ORIGINAL': '',
                'DATA_ESTIMADA': '',
                'PERIODO_ESTIMADO': '',
                'RESPONSAVEL': '',
                'STATUS_VERIFICACAO': 'ADICIONADO_DO_PDF',
                'TIPO_ALERTA': 'NOVO_ITEM',
                'NIVEL_RISCO': '',
                'SUGESTOES': f'Item extraído do PDF página {nota["pagina_pdf"]}',
                'CNPJ_FORNECEDOR': nota.get('cnpj', ''),
                'NOTA_FISCAL_NUM': nota.get('numero_nota', ''),
                'PAGINA_PDF': nota['pagina_pdf'],
                'ORIGEM_DADO': 'PDF'
            }
            novos_itens.append(novo_item)

            valor_display = nota.get('valor_total') or 0.0
            print(f"[+] Página {nota['pagina_pdf']}: {nota.get('fornecedor', 'N/A')[:40]} - R$ {valor_display:.2f}")

    print(f"\n[OK] {len(novos_itens)} novos itens preparados\n")

    # Adicionar colunas novas à planilha original se não existirem
    if 'CNPJ_FORNECEDOR' not in df_excel.columns:
        df_excel['CNPJ_FORNECEDOR'] = ''
    if 'NOTA_FISCAL_NUM' not in df_excel.columns:
        df_excel['NOTA_FISCAL_NUM'] = ''
    if 'PAGINA_PDF' not in df_excel.columns:
        df_excel['PAGINA_PDF'] = ''
    if 'ORIGEM_DADO' not in df_excel.columns:
        df_excel['ORIGEM_DADO'] = 'PLANILHA_ORIGINAL'

    # Enriquecer dados existentes com informações do PDF
    print("="*60)
    print("ENRIQUECENDO DADOS EXISTENTES")
    print("="*60 + "\n")

    enriquecidos = 0
    for chave in em_ambos:
        # Pegar a primeira ocorrência do PDF
        nota_pdf = notas_por_chave[chave][0]

        # Pegar todas as ocorrências na planilha
        for item in itens_planilha[chave]:
            idx = item['index']

            # Completar dados faltantes
            atualizado = False

            # Completar data se estiver vazia
            if (pd.isna(df_excel.at[idx, 'DATA_ORIGINAL']) or
                df_excel.at[idx, 'DATA_ORIGINAL'] == '' or
                df_excel.at[idx, 'DATA_ORIGINAL'] == '-'):
                if nota_pdf.get('data'):
                    df_excel.at[idx, 'DATA_ORIGINAL'] = nota_pdf['data']
                    atualizado = True

            # Adicionar CNPJ se disponível
            if nota_pdf.get('cnpj'):
                df_excel.at[idx, 'CNPJ_FORNECEDOR'] = nota_pdf['cnpj']
                atualizado = True

            # Adicionar número da nota
            if nota_pdf.get('numero_nota'):
                df_excel.at[idx, 'NOTA_FISCAL_NUM'] = nota_pdf['numero_nota']
                atualizado = True

            # Adicionar página do PDF
            df_excel.at[idx, 'PAGINA_PDF'] = nota_pdf['pagina_pdf']
            df_excel.at[idx, 'ORIGEM_DADO'] = 'MESCLADO'

            if atualizado:
                enriquecidos += 1

    print(f"[OK] {enriquecidos} registros enriquecidos com dados do PDF\n")

    # Adicionar novos itens ao DataFrame
    if novos_itens:
        df_novos = pd.DataFrame(novos_itens)
        df_final = pd.concat([df_excel, df_novos], ignore_index=True)
    else:
        df_final = df_excel

    # Estatísticas finais
    print("="*60)
    print("ESTATISTICAS FINAIS")
    print("="*60)
    print(f"Linhas originais: {len(df_excel)}")
    print(f"Linhas adicionadas: {len(novos_itens)}")
    print(f"Linhas finais: {len(df_final)}")
    print(f"Valor total final: R$ {df_final['VLR_TOTAL'].sum():,.2f}")
    print("="*60 + "\n")

    # Salvar planilha atualizada
    output_path = "Gastos_Consolidados_Flame_AUDITORIA_RECONCILIADO.xlsx"
    print(f"Salvando planilha reconciliada em {output_path}...")
    df_final.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha salva!\n")

    # Gerar relatório de reconciliação
    print("Gerando relatório de reconciliação...")
    with open('output/relatorio_reconciliacao.txt', 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("RELATORIO DE RECONCILIACAO: PDF vs PLANILHA\n")
        f.write("="*60 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Páginas do PDF processadas: {len(notas_pdf)}\n")
        f.write(f"Linhas originais na planilha: {len(df_excel)}\n")
        f.write(f"Linhas adicionadas: {len(novos_itens)}\n")
        f.write(f"Linhas finais: {len(df_final)}\n")
        f.write(f"Registros enriquecidos: {enriquecidos}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor total planilha original: R$ {df_excel['VLR_TOTAL'].sum():,.2f}\n")
        f.write(f"Valor total extraído PDF: R$ {valor_total_pdf:,.2f}\n")
        f.write(f"Valor itens adicionados: R$ {valor_faltante:,.2f}\n")
        f.write(f"Valor total final: R$ {df_final['VLR_TOTAL'].sum():,.2f}\n\n")

        f.write("--- ANALISE ---\n")
        f.write(f"Itens em ambos (PDF e Planilha): {len(em_ambos)}\n")
        f.write(f"Itens apenas no PDF (adicionados): {len(so_no_pdf)}\n")
        f.write(f"Itens apenas na planilha: {len(so_na_planilha)}\n\n")

        if so_no_pdf:
            f.write("--- ITENS ADICIONADOS DO PDF ---\n")
            for chave in sorted(so_no_pdf):
                for nota in notas_por_chave[chave]:
                    valor_display = nota.get('valor_total') or 0.0
                    f.write(f"Pág {nota['pagina_pdf']}: {nota.get('fornecedor', 'N/A')[:50]} - ")
                    f.write(f"R$ {valor_display:.2f} - {nota.get('data', 'Sem data')}\n")
            f.write("\n")

        f.write("="*60 + "\n")

    print("[OK] Relatório salvo: output/relatorio_reconciliacao.txt\n")

    print("="*60)
    print("RECONCILIACAO CONCLUIDA!")
    print("="*60)
    print(f"\nArquivo gerado: {output_path}")
    print(f"Relatório: output/relatorio_reconciliacao.txt\n")

if __name__ == "__main__":
    main()
