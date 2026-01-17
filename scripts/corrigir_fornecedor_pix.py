"""
Script para corrigir o fornecedor PIX RESTAURANTE para ELETROMIL COML LTDA
"""

import pandas as pd

def main():
    print("="*80)
    print("CORRIGIR FORNECEDOR: PIX RESTAURANTE -> ELETROMIL COML LTDA")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx")

    # Buscar a linha com PIX RESTAURANTE R$ 2.690,00
    pix_restaurante = df[
        (df['FORNECEDOR'].str.contains('PIX RESTAURANTE', case=False, na=False)) &
        (df['VLR_TOTAL'] == 2690.00)
    ]

    if len(pix_restaurante) == 0:
        print("[!] Nao encontrou PIX RESTAURANTE com R$ 2.690,00")

        # Tentar buscar qualquer um com 2690
        todos_2690 = df[df['VLR_TOTAL'] == 2690.00]
        print(f"\nEncontrados {len(todos_2690)} registros com R$ 2.690,00:")
        for idx, row in todos_2690.iterrows():
            print(f"  Linha {idx+2}: {row['FORNECEDOR']} | {row['DATA_ORIGINAL']}")
        return

    print(f"Encontradas {len(pix_restaurante)} linhas com PIX RESTAURANTE R$ 2.690,00\n")

    for idx, row in pix_restaurante.iterrows():
        linha_excel = idx + 2
        print(f"Linha {linha_excel}:")
        print(f"  Fornecedor ANTES: {row['FORNECEDOR']}")
        print(f"  Valor: R$ {row['VLR_TOTAL']:,.2f}")
        print(f"  Data: {row['DATA_ORIGINAL']}")
        print(f"  Obs atual: {row.get('OBS_ORIGINAL', '')}")

        # Atualizar
        df.at[idx, 'FORNECEDOR'] = 'ELETROMIL COML LTDA'
        df.at[idx, 'CATEGORIA'] = 'Material Eletrico'
        obs_nova = f"Comprovante PIX. CNPJ: 28.416.105/0005-79. Adicionado via revisao manual - Pagina PDF 97. CORRIGIDO: nome real do fornecedor identificado nas fotos originais WhatsApp"
        df.at[idx, 'OBS_ORIGINAL'] = obs_nova

        print(f"\n  Fornecedor DEPOIS: ELETROMIL COML LTDA")
        print(f"  Categoria ATUALIZADA: Material Eletrico")
        print(f"  Obs ATUALIZADA: {obs_nova[:60]}...")

    # Salvar planilha atualizada
    output_file = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_CORRIGIDO.xlsx"
    print(f"\nSalvando planilha atualizada em {output_file}...")
    df.to_excel(output_file, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha atualizada!\n")
    print(f"[!] IMPORTANTE: Feche o arquivo anterior e renomeie este para o nome final")

    # Resumo
    print("="*80)
    print("RESUMO DA CORRECAO")
    print("="*80)
    print(f"Corrigido: PIX RESTAURANTE -> ELETROMIL COML LTDA")
    print(f"Valor: R$ 2.690,00")
    print(f"Data: 17/10/2025")
    print(f"CNPJ: 28.416.105/0005-79")
    print(f"Fonte: Foto original do comprovante PIX nas imagens WhatsApp")
    print("="*80)

if __name__ == "__main__":
    main()
