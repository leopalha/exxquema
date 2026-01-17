"""
Script para detectar duplicidades entre notas fiscais e planilha existente
Critério: Fornecedor + Data + Valor Total
"""

import json
import pandas as pd
from pathlib import Path
import re
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor para comparação"""
    if not fornecedor or pd.isna(fornecedor):
        return ""

    fornecedor = str(fornecedor).upper().strip()

    # Remover pontuação e caracteres especiais
    fornecedor = re.sub(r'[^\w\s]', '', fornecedor)

    # Remover palavras comuns que não identificam o fornecedor
    palavras_remover = ['LTDA', 'ME', 'EIRELI', 'SA', 'S/A', 'EPP', 'CIA']
    for palavra in palavras_remover:
        fornecedor = fornecedor.replace(palavra, '')

    # Remover espaços extras
    fornecedor = ' '.join(fornecedor.split())

    return fornecedor

def normalizar_data(data):
    """Normaliza data para comparação"""
    if not data or pd.isna(data):
        return None

    data_str = str(data).strip()

    # Tentar vários formatos
    formatos = [
        '%d/%m/%Y', '%d-%m-%Y',
        '%d/%m/%y', '%d-%m-%y',
        '%Y-%m-%d',
        '%Y-%m-%d %H:%M:%S'
    ]

    for formato in formatos:
        try:
            dt = datetime.strptime(data_str, formato)
            return dt.strftime('%d/%m/%Y')
        except:
            continue

    return None

def normalizar_valor(valor):
    """Normaliza valor para comparação"""
    if valor is None or pd.isna(valor):
        return 0.0

    try:
        return round(float(valor), 2)
    except:
        return 0.0

def criar_chave_duplicata(fornecedor, data, valor):
    """Cria chave única para detectar duplicatas"""
    fornecedor_norm = normalizar_fornecedor(fornecedor)
    data_norm = normalizar_data(data)
    valor_norm = normalizar_valor(valor)

    if not fornecedor_norm or not data_norm or valor_norm == 0.0:
        return None

    return f"{fornecedor_norm}|{data_norm}|{valor_norm:.2f}"

def detectar_duplicatas_planilha(df):
    """
    Detecta duplicatas dentro da própria planilha

    Args:
        df: DataFrame da planilha

    Returns:
        Set de chaves duplicadas
    """
    print("Detectando duplicatas na planilha existente...")

    chaves_vistas = {}
    duplicatas = set()

    for idx, row in df.iterrows():
        chave = criar_chave_duplicata(
            row.get('FORNECEDOR'),
            row.get('DATA_ORIGINAL'),
            row.get('VLR_TOTAL')
        )

        if not chave:
            continue

        if chave in chaves_vistas:
            duplicatas.add(chave)
            print(f"  Duplicata encontrada: {chave}")
            print(f"    Linha {chaves_vistas[chave] + 2} e Linha {idx + 2}")
        else:
            chaves_vistas[chave] = idx

    print(f"Total de duplicatas na planilha: {len(duplicatas)}")
    return duplicatas, chaves_vistas

def detectar_duplicatas_pdf(notas_json):
    """
    Detecta duplicatas dentro das notas do PDF

    Args:
        notas_json: Lista de notas extraídas do PDF

    Returns:
        Set de chaves duplicadas
    """
    print("Detectando duplicatas nas notas do PDF...")

    chaves_vistas = {}
    duplicatas = set()

    for idx, nota in enumerate(notas_json):
        chave = criar_chave_duplicata(
            nota.get('fornecedor'),
            nota.get('data'),
            nota.get('valor_total')
        )

        if not chave:
            continue

        if chave in chaves_vistas:
            duplicatas.add(chave)
            print(f"  Duplicata encontrada: {chave}")
            print(f"    Página {chaves_vistas[chave]['pagina_pdf']} e Página {nota['pagina_pdf']}")
        else:
            chaves_vistas[chave] = nota

    print(f"Total de duplicatas no PDF: {len(duplicatas)}")
    return duplicatas, chaves_vistas

def detectar_itens_escritos_mao(df):
    """
    Detecta itens possivelmente escritos à mão na planilha
    Critérios: sem data original E fornecedor genérico
    """
    print("Detectando itens possivelmente escritos à mão...")

    itens_mao = []

    for idx, row in df.iterrows():
        suspeito = False
        motivos = []

        # Sem data original
        if pd.isna(row.get('DATA_ORIGINAL')) or row.get('DATA_ORIGINAL') == '' or row.get('DATA_ORIGINAL') == '-':
            suspeito = True
            motivos.append("SEM DATA")

        # Fornecedor genérico
        fornecedor = str(row.get('FORNECEDOR', '')).lower()
        if fornecedor in ['fornecedor', 'não identificado', 'nao identificado', '']:
            suspeito = True
            motivos.append("FORNECEDOR GENÉRICO")

        if suspeito:
            itens_mao.append({
                'linha': idx + 2,  # +2 porque Excel começa em 1 e tem header
                'categoria': row.get('CATEGORIA'),
                'fornecedor': row.get('FORNECEDOR'),
                'item': row.get('ITEM'),
                'valor': row.get('VLR_TOTAL'),
                'motivos': motivos
            })

    print(f"Total de itens suspeitos (escritos à mão): {len(itens_mao)}")
    for item in itens_mao[:10]:  # Mostrar primeiros 10
        print(f"  Linha {item['linha']}: {item['item']} - {item['motivos']}")

    return itens_mao

def processar_deteccao_duplicatas(planilha_path, notas_json_path, output_path):
    """
    Processa detecção de duplicatas e gera relatório

    Args:
        planilha_path: Caminho da planilha Excel
        notas_json_path: Caminho do JSON de notas extraídas
        output_path: Caminho do arquivo de saída
    """
    print("=== DETECÇÃO DE DUPLICATAS ===\n")

    # Carregar planilha
    print(f"Carregando planilha {planilha_path}...")
    df = pd.read_excel(planilha_path)
    print(f"Total de linhas na planilha: {len(df)}\n")

    # Carregar notas do PDF
    print(f"Carregando notas do PDF {notas_json_path}...")
    with open(notas_json_path, 'r', encoding='utf-8') as f:
        notas_json = json.load(f)
    print(f"Total de notas no PDF: {len(notas_json)}\n")

    # Detectar duplicatas na planilha
    dup_planilha, chaves_planilha = detectar_duplicatas_planilha(df)

    # Detectar duplicatas no PDF
    dup_pdf, chaves_pdf = detectar_duplicatas_pdf(notas_json)

    # Detectar itens escritos à mão
    itens_mao = detectar_itens_escritos_mao(df)

    # Detectar overlaps (itens que existem em ambos)
    print("\nDetectando overlaps entre planilha e PDF...")
    overlaps = []

    for chave in chaves_planilha.keys():
        if chave in chaves_pdf:
            overlaps.append({
                'chave': chave,
                'linha_planilha': chaves_planilha[chave] + 2,
                'pagina_pdf': chaves_pdf[chave]['pagina_pdf']
            })

    print(f"Total de overlaps (itens em ambos): {len(overlaps)}")

    # Identificar itens do PDF que NÃO estão na planilha
    print("\nIdentificando itens do PDF que faltam na planilha...")
    itens_faltantes = []

    for chave, nota in chaves_pdf.items():
        if chave not in chaves_planilha:
            itens_faltantes.append(nota)

    print(f"Total de itens do PDF que faltam na planilha: {len(itens_faltantes)}")

    # Salvar relatório
    relatorio = {
        'estatisticas': {
            'total_linhas_planilha': len(df),
            'total_notas_pdf': len(notas_json),
            'duplicatas_na_planilha': len(dup_planilha),
            'duplicatas_no_pdf': len(dup_pdf),
            'itens_escritos_mao': len(itens_mao),
            'overlaps': len(overlaps),
            'itens_faltantes_na_planilha': len(itens_faltantes)
        },
        'duplicatas_planilha': list(dup_planilha),
        'duplicatas_pdf': list(dup_pdf),
        'itens_mao': itens_mao,
        'overlaps': overlaps,
        'itens_faltantes': itens_faltantes
    }

    output_path = Path(output_path)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=2)

    print(f"\nRelatório de duplicatas salvo em {output_path}")

    # Exibir resumo
    print("\n=== RESUMO ===")
    print(f"Planilha: {len(df)} linhas")
    print(f"PDF: {len(notas_json)} notas")
    print(f"Duplicatas na planilha: {len(dup_planilha)}")
    print(f"Duplicatas no PDF: {len(dup_pdf)}")
    print(f"Itens suspeitos (escritos à mão): {len(itens_mao)}")
    print(f"Overlaps (em ambos): {len(overlaps)}")
    print(f"Itens do PDF que faltam na planilha: {len(itens_faltantes)}")

    return relatorio

def main():
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"
    notas_json_path = Path('output/notas_categorizadas.json')
    output_path = Path('output/relatorio_duplicatas.json')

    if not Path(planilha_path).exists():
        print(f"ERRO: Planilha {planilha_path} não encontrada!")
        return

    if not notas_json_path.exists():
        print(f"ERRO: Arquivo {notas_json_path} não encontrado!")
        print("Execute primeiro os scripts extract_invoice_data.py e categorize_items.py")
        return

    processar_deteccao_duplicatas(planilha_path, notas_json_path, output_path)

if __name__ == "__main__":
    main()
