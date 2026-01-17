"""
Script para verificar TODOS os valores > R$ 1.000 na planilha final
"""

import pandas as pd

def main():
    print("="*80)
    print("VERIFICACAO COMPLETA: VALORES > R$ 1.000")
    print("="*80 + "\n")

    # Carregar planilha final
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx")

    # Filtrar valores > 1000
    valores_altos = df[df['VLR_TOTAL'] > 1000].sort_values('VLR_TOTAL', ascending=False)

    print(f"Total de itens com valor > R$ 1.000: {len(valores_altos)}\n")
    print("="*80)

    # Agrupar por categoria
    print("\nDISTRIBUICAO POR CATEGORIA:")
    print("-"*80)
    categorias = valores_altos.groupby('CATEGORIA').agg({
        'VLR_TOTAL': ['count', 'sum']
    }).round(2)
    categorias.columns = ['Quantidade', 'Valor Total']
    categorias = categorias.sort_values('Valor Total', ascending=False)

    for categoria, row in categorias.iterrows():
        print(f"{categoria:30s}: {int(row['Quantidade']):2d} itens | R$ {row['Valor Total']:>12,.2f}")

    # Listar TODOS os 48 itens
    print("\n" + "="*80)
    print("LISTA COMPLETA DOS 48 ITENS > R$ 1.000")
    print("="*80 + "\n")

    for i, (idx, row) in enumerate(valores_altos.iterrows(), 1):
        fornecedor = row['FORNECEDOR'][:35]
        valor = row['VLR_TOTAL']
        data = row['DATA_ORIGINAL'] if pd.notna(row['DATA_ORIGINAL']) else '-'
        categoria = row['CATEGORIA'][:25]
        obs = str(row.get('OBS_ORIGINAL', ''))[:40] if pd.notna(row.get('OBS_ORIGINAL', '')) else ''

        print(f"{i:2d}. {fornecedor:35s} | R$ {valor:>10,.2f} | {data:12s} | {categoria}")
        if obs and 'Pagina PDF' in obs:
            pagina = obs.split('Pagina PDF')[1].strip()[:3]
            print(f"    Origem: Pagina PDF {pagina}")
        elif obs:
            print(f"    Obs: {obs}")

    # Verificar CityLar e MT Solitech especificamente
    print("\n" + "="*80)
    print("VERIFICACAO CITYLAR E MT SOLITECH")
    print("="*80 + "\n")

    citylar_planilha = df[df['FORNECEDOR'].str.contains('CITYLAR', case=False, na=False)]
    solitech_planilha = df[df['FORNECEDOR'].str.contains('SOLITECH', case=False, na=False)]

    print(f"CityLar na planilha: {len(citylar_planilha)} notas")
    print(f"Valor total CityLar: R$ {citylar_planilha['VLR_TOTAL'].sum():,.2f}\n")

    print("Notas CityLar:")
    for idx, row in citylar_planilha.iterrows():
        print(f"  Linha {idx+2}: R$ {row['VLR_TOTAL']:>10,.2f} | {row['DATA_ORIGINAL']}")

    print(f"\nMT Solitech na planilha: {len(solitech_planilha)} notas")
    print(f"Valor total Solitech: R$ {solitech_planilha['VLR_TOTAL'].sum():,.2f}\n")

    print("Notas MT Solitech:")
    for idx, row in solitech_planilha.iterrows():
        print(f"  Linha {idx+2}: R$ {row['VLR_TOTAL']:>10,.2f} | {row.get('DATA_ORIGINAL', '-')}")

    # Resumo final
    print("\n" + "="*80)
    print("RESUMO FINAL")
    print("="*80)
    print(f"Total de itens > R$ 1.000: {len(valores_altos)}")
    print(f"Valor total dos itens > R$ 1.000: R$ {valores_altos['VLR_TOTAL'].sum():,.2f}")
    print(f"Percentual do total geral: {(valores_altos['VLR_TOTAL'].sum() / df['VLR_TOTAL'].sum() * 100):.1f}%")
    print(f"\nCityLar: {len(citylar_planilha)} notas (esperado: 5 legiveis)")
    print(f"MT Solitech: {len(solitech_planilha)} notas (esperado: 4)")
    print("="*80)

if __name__ == "__main__":
    main()
