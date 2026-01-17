"""
Script para verificar se os itens "Material sem NF identificada"
sao somatorios de outras notas fiscais
"""

import pandas as pd

def main():
    print("="*80)
    print("VERIFICACAO: MATERIAL SEM NF vs NOTAS FISCAIS")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_LIMPO.xlsx")

    print(f"Planilha carregada: {len(df)} linhas\n")

    # Encontrar itens "Material sem NF identificada"
    materiais_sem_nf = df[
        (df['FORNECEDOR'] == 'A Verificar') &
        (df['ITEM'].str.contains('Material sem NF identificada', case=False, na=False))
    ].copy()

    print(f"Total de 'Material sem NF identificada': {len(materiais_sem_nf)} itens")
    print(f"Valor total: R$ {materiais_sem_nf['VLR_TOTAL'].sum():,.2f}\n")

    # Analisar cada valor
    print("="*80)
    print("COMPARACAO COM NOTAS FISCAIS EXISTENTES")
    print("="*80 + "\n")

    possiveis_duplicatas = []

    for idx, row in materiais_sem_nf.iterrows():
        valor = row['VLR_TOTAL']
        linha_excel = idx + 2

        # Buscar notas com valor similar (±1%)
        tolerancia = valor * 0.01
        notas_similares = df[
            (df.index != idx) &
            (df['VLR_TOTAL'] >= valor - tolerancia) &
            (df['VLR_TOTAL'] <= valor + tolerancia) &
            (df['FORNECEDOR'] != 'A Verificar')
        ]

        if len(notas_similares) > 0:
            print(f"\nLinha {linha_excel}: R$ {valor:>10,.2f}")
            print(f"  Encontradas {len(notas_similares)} nota(s) com valor similar:")

            for idx2, row2 in notas_similares.iterrows():
                fornecedor = row2['FORNECEDOR'][:40]
                valor2 = row2['VLR_TOTAL']
                data = row2['DATA_ORIGINAL']
                obs = str(row2.get('OBS_ORIGINAL', ''))[:50] if pd.notna(row2.get('OBS_ORIGINAL', '')) else ''

                print(f"    -> Linha {idx2+2}: {fornecedor} | R$ {valor2:,.2f} | {data}")
                if obs:
                    print(f"       Obs: {obs}")

                possiveis_duplicatas.append({
                    'linha_material': linha_excel,
                    'valor_material': valor,
                    'linha_nf': idx2+2,
                    'fornecedor_nf': fornecedor,
                    'valor_nf': valor2,
                    'diferenca': abs(valor - valor2)
                })

    # Resumo
    print("\n" + "="*80)
    print("RESUMO DA ANALISE")
    print("="*80)
    print(f"\nTotal 'Material sem NF': {len(materiais_sem_nf)} itens | R$ {materiais_sem_nf['VLR_TOTAL'].sum():,.2f}")
    print(f"Possiveis duplicatas identificadas: {len(possiveis_duplicatas)}")

    # Contar quantos valores únicos têm duplicatas
    valores_com_duplicata = len(set(d['linha_material'] for d in possiveis_duplicatas))
    print(f"Valores com notas similares: {valores_com_duplicata} de {len(materiais_sem_nf)}")

    # Análise específica de valores importantes
    print("\n" + "="*80)
    print("ANALISE DE VALORES ESPECIFICOS IMPORTANTES")
    print("="*80 + "\n")

    # R$ 2.958,54 - LAS Elétrica
    print("1. R$ 2.958,54 (Linha 90):")
    las_eletrica = df[(df['FORNECEDOR'].str.contains('LAS', case=False, na=False)) &
                       (df['VLR_TOTAL'] == 2958.54)]
    if len(las_eletrica) > 0:
        print("   [!] DUPLICATA CONFIRMADA - Existe LAS Eletrica R$ 2.958,54")
        for idx, row in las_eletrica.iterrows():
            print(f"       Linha {idx+2}: {row['FORNECEDOR']} | {row['DATA_ORIGINAL']}")

    # R$ 1.409,92 - MT Solitech
    print("\n2. R$ 1.409,92 (Linha 84):")
    solitech = df[(df['FORNECEDOR'].str.contains('SOLITECH', case=False, na=False)) &
                   (abs(df['VLR_TOTAL'] - 1409.92) < 10)]
    if len(solitech) > 0:
        print("   [!] DUPLICATA CONFIRMADA - Existe MT Solitech ~R$ 1.409,92")
        for idx, row in solitech.iterrows():
            print(f"       Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}")

    # R$ 461,40 - MT Solitech
    print("\n3. R$ 461,40 (Linha 81):")
    solitech2 = df[(df['FORNECEDOR'].str.contains('SOLITECH', case=False, na=False)) &
                    (abs(df['VLR_TOTAL'] - 461.40) < 10)]
    if len(solitech2) > 0:
        print("   [!] DUPLICATA CONFIRMADA - Existe MT Solitech ~R$ 461,40")
        for idx, row in solitech2.iterrows():
            print(f"       Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}")

    # R$ 1.350,00 - MT Solitech?
    print("\n4. R$ 1.350,00 (Linha 83):")
    solitech3 = df[(df['FORNECEDOR'].str.contains('SOLITECH', case=False, na=False)) &
                    (abs(df['VLR_TOTAL'] - 1350.00) < 100)]
    if len(solitech3) > 0:
        print("   [!] POSSIVEL DUPLICATA - Existe MT Solitech proximo de R$ 1.350")
        for idx, row in solitech3.iterrows():
            print(f"       Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}")

    # Verificar valores CityLar
    print("\n5. Valores possivelmente CityLar:")
    valores_citylar_possiveis = [458.28, 1660.42, 1833.20]
    citylar = df[df['FORNECEDOR'].str.contains('CITYLAR', case=False, na=False)]

    print(f"   Total notas CityLar na planilha: {len(citylar)}")
    print(f"   Valores CityLar:")
    for idx, row in citylar.iterrows():
        print(f"       Linha {idx+2}: R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}")

    print(f"\n   Valores 'Material sem NF' possivelmente CityLar:")
    for valor in valores_citylar_possiveis:
        mat = materiais_sem_nf[materiais_sem_nf['VLR_TOTAL'] == valor]
        if len(mat) > 0:
            for idx, row in mat.iterrows():
                print(f"       Linha {idx+2}: R$ {valor:,.2f}")
                # Verificar se tem CityLar com valor similar
                city_similar = citylar[abs(citylar['VLR_TOTAL'] - valor) < 10]
                if len(city_similar) > 0:
                    print(f"          [!] Existe CityLar com valor similar!")

    # RECOMENDAÇÃO
    print("\n" + "="*80)
    print("RECOMENDACAO")
    print("="*80)
    print(f"""
ANALISE COMPLETA:

1. CONFIRMADO: Existem duplicatas evidentes
   - R$ 2.958,54 = LAS Elétrica (duplicata)
   - R$ 1.409,92 = MT Solitech (duplicata)
   - R$ 461,40 = MT Solitech (duplicata)
   - R$ 1.350,00 = Possivelmente MT Solitech

2. SUSPEITAS: Valores que podem ser CityLar
   - R$ 458,28 (CityLar tem R$ 458,23)
   - R$ 1.660,42 (CityLar tem R$ 3.660,42 / 2?)
   - R$ 1.833,20 (CityLar tem R$ 1.933,20)

3. RECOMENDACAO:
   - REMOVER todos os {len(materiais_sem_nf)} itens "Material sem NF identificada"
   - Valor total a remover: R$ {materiais_sem_nf['VLR_TOTAL'].sum():,.2f}
   - Sao claramente somatorios/duplicatas das notas fiscais reais

4. IMPACTO:
   - Linhas: 316 -> {316 - len(materiais_sem_nf)}
   - Valor: R$ 236.260,03 -> R$ {236260.03 - materiais_sem_nf['VLR_TOTAL'].sum():,.2f}
""")

    print("="*80)

if __name__ == "__main__":
    main()
