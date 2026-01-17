"""
Script para remover itens "Material sem NF identificada"
que são duplicatas/somatórios de notas fiscais reais
"""

import pandas as pd
from datetime import datetime

def main():
    print("="*80)
    print("REMOVER MATERIAIS SEM NF (DUPLICATAS/SOMATORIOS)")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_LIMPO.xlsx")

    linhas_inicial = len(df)
    valor_inicial = df['VLR_TOTAL'].sum()

    print(f"Planilha carregada: {linhas_inicial} linhas | R$ {valor_inicial:,.2f}\n")

    # Identificar materiais sem NF
    materiais_sem_nf = df[
        (df['FORNECEDOR'] == 'A Verificar') &
        (df['ITEM'].str.contains('Material sem NF identificada', case=False, na=False))
    ]

    # Também remover Fretes Material genéricos
    fretes_material = df[
        (df['FORNECEDOR'] == 'Fornecedor') &
        (df['ITEM'].str.contains('Frete Material', case=False, na=False))
    ]

    # Combinar
    indices_remover = list(materiais_sem_nf.index) + list(fretes_material.index)

    print(f"Itens identificados para remoção:")
    print(f"  - Material sem NF identificada: {len(materiais_sem_nf)} itens")
    print(f"  - Frete Material (genérico): {len(fretes_material)} itens")
    print(f"  - TOTAL: {len(indices_remover)} itens\n")

    valor_remover = df.loc[indices_remover, 'VLR_TOTAL'].sum()
    print(f"Valor total a remover: R$ {valor_remover:,.2f}\n")

    # Listar alguns exemplos
    print("Exemplos de itens que serão removidos:")
    print("-"*80)
    for idx in indices_remover[:10]:
        row = df.loc[idx]
        print(f"Linha {idx+2}: {row['FORNECEDOR']:20s} | {row['ITEM'][:35]:35s} | R$ {row['VLR_TOTAL']:>10,.2f}")
    if len(indices_remover) > 10:
        print(f"... e mais {len(indices_remover) - 10} itens")
    print("-"*80 + "\n")

    # Remover
    df_limpo = df.drop(indices_remover).reset_index(drop=True)

    linhas_final = len(df_limpo)
    valor_final = df_limpo['VLR_TOTAL'].sum()

    # Resultado
    print("="*80)
    print("RESULTADO")
    print("="*80)
    print(f"\nANTES:")
    print(f"   Linhas: {linhas_inicial}")
    print(f"   Valor: R$ {valor_inicial:,.2f}")
    print(f"\nREMOVIDO:")
    print(f"   Linhas: {len(indices_remover)}")
    print(f"   Valor: R$ {valor_remover:,.2f}")
    print(f"\nDEPOIS:")
    print(f"   Linhas: {linhas_final}")
    print(f"   Valor: R$ {valor_final:,.2f}")
    print(f"\nDIFERENCA:")
    print(f"   Linhas: {linhas_inicial - linhas_final}")
    print(f"   Valor: R$ {valor_inicial - valor_final:,.2f}")
    print("="*80 + "\n")

    # Salvar
    output_file = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_CLEAN.xlsx"
    print(f"Salvando planilha limpa em {output_file}...")
    df_limpo.to_excel(output_file, index=False, sheet_name='Auditoria Gastos')
    print(f"[OK] Planilha limpa salva!\n")

    # Relatório
    with open('output/relatorio_remocao_materiais_sem_nf.txt', 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RELATORIO DE REMOCAO DE MATERIAIS SEM NF\n")
        f.write("="*80 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Linhas antes: {linhas_inicial}\n")
        f.write(f"Linhas removidas: {len(indices_remover)}\n")
        f.write(f"Linhas depois: {linhas_final}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor antes: R$ {valor_inicial:,.2f}\n")
        f.write(f"Valor removido: R$ {valor_remover:,.2f}\n")
        f.write(f"Valor depois: R$ {valor_final:,.2f}\n\n")

        f.write("--- JUSTIFICATIVA ---\n")
        f.write("Os itens 'Material sem NF identificada' e 'Frete Material' genéricos\n")
        f.write("foram identificados como somatórios/duplicatas de notas fiscais reais.\n\n")
        f.write("Exemplos de duplicatas confirmadas:\n")
        f.write("- R$ 2.958,54 = LAS Elétrica (duplicata)\n")
        f.write("- R$ 1.409,92 = MT Solitech (duplicata)\n")
        f.write("- R$ 461,40 = MT Solitech (duplicata)\n")
        f.write("- R$ 458,28 = CityLar (duplicata)\n\n")

        f.write("--- ITENS REMOVIDOS ---\n")
        for idx in indices_remover:
            row = df.loc[idx]
            f.write(f"Linha {idx+2}: {row['FORNECEDOR']} | {row['ITEM']} | R$ {row['VLR_TOTAL']:,.2f}\n")

        f.write("\n" + "="*80 + "\n")

    print(f"[OK] Relatório salvo: output/relatorio_remocao_materiais_sem_nf.txt\n")

    print("="*80)
    print("PROCESSO CONCLUIDO!")
    print("="*80)
    print(f"\nArquivo gerado: {output_file}")
    print(f"Linhas: {linhas_final}")
    print(f"Valor: R$ {valor_final:,.2f}\n")

if __name__ == "__main__":
    main()
