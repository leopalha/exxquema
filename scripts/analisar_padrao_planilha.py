"""
Script para analisar o padrao da planilha original
Identificar como os itens estao detalhados (QTD, VLR_UNIT, VLR_TOTAL)
"""

import pandas as pd

def main():
    print("="*80)
    print("ANALISE DO PADRAO DA PLANILHA ORIGINAL")
    print("="*80 + "\n")

    # Carregar planilha limpa
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_CLEAN.xlsx")

    print(f"Planilha carregada: {len(df)} linhas\n")

    # Separar itens originais vs adicionados na revisao manual
    originais = df[df['STATUS_VERIFICACAO'] != 'VERIFICADO_MANUALMENTE'].copy()
    revisao_manual = df[df['STATUS_VERIFICACAO'] == 'VERIFICADO_MANUALMENTE'].copy()

    print(f"Itens ORIGINAIS: {len(originais)} linhas")
    print(f"Itens REVISAO MANUAL: {len(revisao_manual)} linhas\n")

    # Analisar estrutura dos originais
    print("="*80)
    print("EXEMPLOS DE ITENS ORIGINAIS (PADRAO CORRETO)")
    print("="*80 + "\n")

    # Mostrar primeiros 30 itens originais
    print("Colunas: FORNECEDOR | ITEM | QTD | VLR_UNIT | VLR_TOTAL\n")
    print("-"*80)

    for idx, row in originais.head(30).iterrows():
        fornecedor = str(row['FORNECEDOR'])[:25]
        item = str(row['ITEM'])[:35]
        qtd = row.get('QTD', 1)
        vlr_unit = row.get('VLR_UNIT', row['VLR_TOTAL'])
        vlr_total = row['VLR_TOTAL']

        print(f"{fornecedor:25s} | {item:35s} | {qtd:>6} | R$ {vlr_unit:>9,.2f} | R$ {vlr_total:>9,.2f}")

    print("-"*80 + "\n")

    # Analisar um fornecedor especifico com multiplos itens
    print("="*80)
    print("EXEMPLO: FORNECEDOR COM MULTIPLOS ITENS")
    print("="*80 + "\n")

    # Procurar fornecedor que aparece varias vezes (multiplos itens da mesma nota)
    fornecedores_freq = originais['FORNECEDOR'].value_counts()

    # Pegar um fornecedor que tem entre 3-10 itens
    for fornecedor, count in fornecedores_freq.items():
        if 3 <= count <= 10:
            print(f"Fornecedor: {fornecedor}")
            print(f"Total de linhas: {count}\n")

            items_fornecedor = originais[originais['FORNECEDOR'] == fornecedor]

            print("Todos os itens deste fornecedor:")
            print("-"*80)
            for idx, row in items_fornecedor.iterrows():
                item = str(row['ITEM'])[:40]
                qtd = row.get('QTD', 1)
                vlr_unit = row.get('VLR_UNIT', row['VLR_TOTAL'])
                vlr_total = row['VLR_TOTAL']
                data = row.get('DATA_ORIGINAL', '')

                print(f"  {item:40s} | Qtd: {qtd:>4} | Unit: R$ {vlr_unit:>8,.2f} | Total: R$ {vlr_total:>9,.2f} | Data: {data}")

            print(f"\nTotal gasto com {fornecedor}: R$ {items_fornecedor['VLR_TOTAL'].sum():,.2f}")
            print("-"*80 + "\n")
            break

    # Comparar com itens da revisao manual
    print("="*80)
    print("EXEMPLOS DE ITENS DA REVISAO MANUAL (PADRAO INCORRETO)")
    print("="*80 + "\n")

    print("Colunas: FORNECEDOR | ITEM | QTD | VLR_UNIT | VLR_TOTAL\n")
    print("-"*80)

    for idx, row in revisao_manual.head(20).iterrows():
        fornecedor = str(row['FORNECEDOR'])[:25]
        item = str(row['ITEM'])[:35]
        qtd = row.get('QTD', 1)
        vlr_unit = row.get('VLR_UNIT', row['VLR_TOTAL'])
        vlr_total = row['VLR_TOTAL']

        print(f"{fornecedor:25s} | {item:35s} | {qtd:>6} | R$ {vlr_unit:>9,.2f} | R$ {vlr_total:>9,.2f}")

    print("-"*80 + "\n")

    # Analise estatistica
    print("="*80)
    print("ANALISE ESTATISTICA")
    print("="*80 + "\n")

    print("ITENS ORIGINAIS:")
    print(f"  - Total linhas: {len(originais)}")
    print(f"  - Valor total: R$ {originais['VLR_TOTAL'].sum():,.2f}")
    print(f"  - Valor medio por linha: R$ {originais['VLR_TOTAL'].mean():,.2f}")
    print(f"  - Valor mediano: R$ {originais['VLR_TOTAL'].median():,.2f}")
    print(f"  - Fornecedores unicos: {originais['FORNECEDOR'].nunique()}")

    print("\nITENS REVISAO MANUAL:")
    print(f"  - Total linhas: {len(revisao_manual)}")
    print(f"  - Valor total: R$ {revisao_manual['VLR_TOTAL'].sum():,.2f}")
    print(f"  - Valor medio por linha: R$ {revisao_manual['VLR_TOTAL'].mean():,.2f}")
    print(f"  - Valor mediano: R$ {revisao_manual['VLR_TOTAL'].median():,.2f}")
    print(f"  - Fornecedores unicos: {revisao_manual['FORNECEDOR'].nunique()}")

    print("\n" + "="*80)
    print("CONCLUSAO")
    print("="*80)
    print("""
PADRAO IDENTIFICADO:
- Cada ITEM de uma nota fiscal = 1 LINHA na planilha
- Colunas obrigatorias: FORNECEDOR, ITEM, QTD, VLR_UNIT, VLR_TOTAL
- Notas com multiplos itens = multiplas linhas com mesmo FORNECEDOR e DATA
- VLR_UNIT * QTD = VLR_TOTAL (para cada linha)

PROBLEMA DOS ITENS DA REVISAO MANUAL:
- Apenas 1 linha por nota fiscal (ao inves de 1 linha por item)
- ITEM contem descricao generica/combinada
- QTD = 1 sempre (incorreto)
- VLR_UNIT = VLR_TOTAL (porque soh tem 1 linha)

ACAO NECESSARIA:
- Re-extrair os {0} itens da revisao manual
- Para cada nota fiscal, extrair TODOS os itens individuais
- Criar 1 linha para CADA item com sua QTD e VLR_UNIT especificos
- Resultado: {0} linhas vao se expandir para ~200-400 linhas (estimativa)
""".format(len(revisao_manual)))

    print("="*80 + "\n")

    # Salvar relatorio
    with open('output/relatorio_analise_padrao.txt', 'w', encoding='utf-8') as f:
        f.write("ANALISE DO PADRAO DA PLANILHA\n")
        f.write("="*80 + "\n\n")

        f.write(f"Total linhas: {len(df)}\n")
        f.write(f"  - Originais: {len(originais)}\n")
        f.write(f"  - Revisao manual: {len(revisao_manual)}\n\n")

        f.write("PADRAO CORRETO (originais):\n")
        f.write("  1 linha = 1 item de nota fiscal\n")
        f.write("  Colunas: FORNECEDOR, ITEM, QTD, VLR_UNIT, VLR_TOTAL\n\n")

        f.write("PADRAO INCORRETO (revisao manual):\n")
        f.write("  1 linha = 1 nota fiscal inteira\n")
        f.write("  Itens nao detalhados individualmente\n\n")

        f.write(f"ACAO: Re-extrair {len(revisao_manual)} notas em formato detalhado\n")

    print("[OK] Relatorio salvo: output/relatorio_analise_padrao.txt\n")

if __name__ == "__main__":
    main()
