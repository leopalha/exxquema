"""
Script para adicionar itens que estão no PDF mas faltam na planilha
Identifica itens do PDF que não têm correspondente na planilha e os adiciona
"""

import pandas as pd
import json
import re
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor"""
    if not fornecedor or pd.isna(fornecedor):
        return ""
    fornecedor = str(fornecedor).upper().strip()
    fornecedor = re.sub(r'[^\w\s]', '', fornecedor)
    palavras_remover = ['LTDA', 'ME', 'EIRELI', 'SA', 'S/A', 'EPP', 'CIA']
    for palavra in palavras_remover:
        fornecedor = fornecedor.replace(palavra, '')
    return ' '.join(fornecedor.split())

def verificar_existe_na_planilha(df, nota):
    """Verifica se uma nota do PDF já existe na planilha"""

    # Se não tem valor, não precisa adicionar
    if not nota.get('valor_total') or nota['valor_total'] == 0:
        return True

    # Se não tem data, difícil comparar
    if not nota.get('data'):
        return True  # Assumir que existe para não duplicar

    valor = nota['valor_total']
    data = nota['data']

    # Buscar por data e valor similar (±5%)
    resultados = df[
        (df['DATA_ORIGINAL'] == data) &
        (df['VLR_TOTAL'].between(valor * 0.95, valor * 1.05))
    ]

    if len(resultados) > 0:
        return True  # Já existe

    # Buscar apenas por valor alto (> R$ 500) mesmo sem data bater
    if valor > 500:
        resultados = df[df['VLR_TOTAL'].between(valor * 0.95, valor * 1.05)]
        if len(resultados) > 0:
            return True

    return False  # Não encontrado

def categorizar_item(fornecedor, valor):
    """Tenta categorizar o item baseado no fornecedor"""
    forn_upper = str(fornecedor).upper()

    if 'ZONASUL' in forn_upper or 'ZONA SUL' in forn_upper or 'SUPERMERCADO' in forn_upper:
        return 'Alimentação'
    elif 'ELETRIC' in forn_upper or 'LAS' in forn_upper:
        return 'Material Elétrico'
    elif 'MATERIAL' in forn_upper or 'CONSTRUC' in forn_upper or 'BNB' in forn_upper:
        return 'Material de Construção'
    elif 'PROPOSTA' in forn_upper:
        return 'Equipamentos'
    elif valor > 1000:
        return 'Equipamentos'
    else:
        return 'A CATEGORIZAR'

def main():
    print("="*60)
    print("ADICIONAR ITENS FALTANTES DO PDF NA PLANILHA")
    print("="*60 + "\n")

    # Carregar planilha corrigida
    print("Carregando planilha corrigida...")
    df = pd.read_excel('Gastos_Consolidados_Flame_AUDITORIA_CORRIGIDO.xlsx')
    print(f"[OK] {len(df)} linhas na planilha")
    valor_antes = df['VLR_TOTAL'].sum()
    print(f"[OK] Valor total: R$ {valor_antes:,.2f}\n")

    # Carregar dados do PDF
    print("Carregando dados do PDF...")
    with open('output/notas_extraidas_parsed.json', 'r', encoding='utf-8') as f:
        notas_pdf = json.load(f)
    print(f"[OK] {len(notas_pdf)} páginas do PDF\n")

    # Identificar itens faltantes
    print("="*60)
    print("IDENTIFICANDO ITENS FALTANTES")
    print("="*60 + "\n")

    itens_faltantes = []

    for nota in notas_pdf:
        # Pular se não tem valor
        if not nota.get('valor_total') or nota['valor_total'] == 0:
            continue

        # Pular valores muito baixos (< R$ 20)
        if nota['valor_total'] < 20:
            continue

        # Verificar se já existe na planilha
        if not verificar_existe_na_planilha(df, nota):
            itens_faltantes.append(nota)
            print(f"[+] Página {nota['pagina_pdf']}: {nota.get('fornecedor', 'N/A')[:45]} - R$ {nota['valor_total']:,.2f}")

    print(f"\n[OK] Encontrados {len(itens_faltantes)} itens faltantes\n")

    if len(itens_faltantes) == 0:
        print("[OK] Nenhum item faltante encontrado. Planilha está completa!")
        return

    # Preparar novos itens
    print("="*60)
    print("PREPARANDO NOVOS ITENS")
    print("="*60 + "\n")

    novos_itens = []
    for nota in itens_faltantes:
        categoria = categorizar_item(nota.get('fornecedor'), nota['valor_total'])

        novo_item = {
            'CATEGORIA': categoria,
            'FORNECEDOR': nota.get('fornecedor', 'Fornecedor'),
            'ITEM': f"Conforme NF página {nota['pagina_pdf']}",
            'QTD': 1,
            'VLR_UNIT': nota['valor_total'],
            'VLR_TOTAL': nota['valor_total'],
            'DATA_ORIGINAL': nota.get('data', ''),
            'OBS_ORIGINAL': f"Extraído do PDF página {nota['pagina_pdf']}",
            'DATA_ESTIMADA': '',
            'PERIODO_ESTIMADO': '',
            'RESPONSAVEL': '',
            'STATUS_VERIFICACAO': 'ADICIONADO_DO_PDF',
            'TIPO_ALERTA': 'ITEM_FALTANTE_ADICIONADO',
            'NIVEL_RISCO': '',
            'SUGESTOES': f'Item estava no PDF mas faltava na planilha. Verificar detalhes na nota fiscal.',
        }

        # Adicionar colunas adicionais se existirem
        if 'CNPJ_FORNECEDOR' in df.columns:
            novo_item['CNPJ_FORNECEDOR'] = nota.get('cnpj', '')
        if 'NOTA_FISCAL_NUM' in df.columns:
            novo_item['NOTA_FISCAL_NUM'] = nota.get('numero_nota', '')
        if 'PAGINA_PDF' in df.columns:
            novo_item['PAGINA_PDF'] = nota['pagina_pdf']
        if 'ORIGEM_DADO' in df.columns:
            novo_item['ORIGEM_DADO'] = 'PDF_FALTANTE'

        novos_itens.append(novo_item)

    # Adicionar à planilha
    df_novos = pd.DataFrame(novos_itens)
    df_final = pd.concat([df, df_novos], ignore_index=True)

    valor_depois = df_final['VLR_TOTAL'].sum()
    valor_adicionado = valor_depois - valor_antes

    # Estatísticas
    print("="*60)
    print("ESTATISTICAS")
    print("="*60)
    print(f"Linhas antes: {len(df)}")
    print(f"Linhas adicionadas: {len(novos_itens)}")
    print(f"Linhas final: {len(df_final)}")
    print()
    print(f"Valor antes: R$ {valor_antes:,.2f}")
    print(f"Valor adicionado: R$ {valor_adicionado:,.2f}")
    print(f"Valor final: R$ {valor_depois:,.2f}")
    print("="*60 + "\n")

    # Salvar
    output_path = "Gastos_Consolidados_Flame_AUDITORIA_COMPLETO.xlsx"
    print(f"Salvando planilha completa em {output_path}...")
    df_final.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha completa salva!\n")

    # Relatório detalhado dos itens adicionados
    with open('output/relatorio_itens_adicionados.txt', 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("ITENS ADICIONADOS DO PDF\n")
        f.write("="*60 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write(f"Total de itens adicionados: {len(novos_itens)}\n")
        f.write(f"Valor total adicionado: R$ {valor_adicionado:,.2f}\n\n")

        f.write("--- ITENS ADICIONADOS ---\n")
        for i, nota in enumerate(itens_faltantes, 1):
            f.write(f"\n{i}. Página {nota['pagina_pdf']}:\n")
            f.write(f"   Fornecedor: {nota.get('fornecedor', 'N/A')}\n")
            f.write(f"   CNPJ: {nota.get('cnpj', 'N/A')}\n")
            f.write(f"   Data: {nota.get('data', 'Sem data')}\n")
            f.write(f"   Valor: R$ {nota['valor_total']:,.2f}\n")

        f.write("\n" + "="*60 + "\n")

    print("[OK] Relatório salvo: output/relatorio_itens_adicionados.txt\n")

    print("="*60)
    print("CONCLUIDO!")
    print("="*60)
    print(f"\nArquivo gerado: {output_path}")
    print(f"Valor final: R$ {valor_depois:,.2f}\n")

if __name__ == "__main__":
    main()
