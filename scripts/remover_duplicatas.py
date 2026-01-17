"""
Script para remover duplicatas identificadas na planilha
"""

import pandas as pd
from datetime import datetime

def main():
    print("="*80)
    print("REMOVER DUPLICATAS DA PLANILHA")
    print("="*80 + "\n")

    # Carregar planilha (usar a corrigida se existir, senão a final)
    try:
        planilha_path = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_CORRIGIDO.xlsx"
        df = pd.read_excel(planilha_path)
        print(f"Carregando planilha corrigida: {planilha_path}")
    except:
        planilha_path = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx"
        df = pd.read_excel(planilha_path)
        print(f"Carregando planilha: {planilha_path}")

    linhas_inicial = len(df)
    valor_inicial = df['VLR_TOTAL'].sum()

    print(f"[OK] Planilha carregada")
    print(f"     Linhas: {linhas_inicial}")
    print(f"     Valor total: R$ {valor_inicial:,.2f}\n")

    # Identificar duplicatas
    print("Identificando duplicatas...\n")

    # Criar chave de duplicata
    df['CHAVE_DUPLICATA'] = (
        df['FORNECEDOR'].astype(str).str.upper().str.strip() + '_' +
        df['DATA_ORIGINAL'].astype(str) + '_' +
        df['VLR_TOTAL'].round(2).astype(str)
    )

    # Encontrar duplicatas
    duplicatas = df[df['CHAVE_DUPLICATA'].duplicated(keep=False)]

    if len(duplicatas) == 0:
        print("[OK] Nenhuma duplicata encontrada!")
        return

    print(f"[!] Encontradas {len(duplicatas)} linhas duplicadas em {len(duplicatas['CHAVE_DUPLICATA'].unique())} grupos\n")

    # Lista de indices para remover
    indices_para_remover = []

    # Processar cada grupo de duplicatas
    print("="*80)
    print("GRUPOS DE DUPLICATAS")
    print("="*80 + "\n")

    for i, chave in enumerate(duplicatas['CHAVE_DUPLICATA'].unique(), 1):
        grupo = df[df['CHAVE_DUPLICATA'] == chave].copy()

        print(f"\nGRUPO {i} - {len(grupo)} ocorrencias:")
        print(f"Fornecedor: {grupo.iloc[0]['FORNECEDOR']}")
        print(f"Valor: R$ {grupo.iloc[0]['VLR_TOTAL']:,.2f}")
        print(f"Data: {grupo.iloc[0]['DATA_ORIGINAL']}")
        print(f"\nLinhas:")

        for idx, row in grupo.iterrows():
            obs = str(row.get('OBS_ORIGINAL', ''))[:50] if pd.notna(row.get('OBS_ORIGINAL', '')) else ''
            status = row.get('STATUS_VERIFICACAO', '')
            print(f"  Linha {idx+2}: Obs: {obs} | Status: {status}")

        # REGRAS DE REMOÇÃO
        # Regra 1: Se um é da revisao manual e outro é original, manter o original
        tem_revisao_manual = any('revisao manual' in str(row.get('OBS_ORIGINAL', '')).lower() for idx, row in grupo.iterrows())
        tem_original = any('revisao manual' not in str(row.get('OBS_ORIGINAL', '')).lower() for idx, row in grupo.iterrows())

        if tem_revisao_manual and tem_original and len(grupo) == 2:
            # Remover o da revisão manual (é duplicata da original)
            for idx, row in grupo.iterrows():
                if 'revisao manual' in str(row.get('OBS_ORIGINAL', '')).lower():
                    indices_para_remover.append(idx)
                    print(f"  -> REMOVER linha {idx+2} (duplicata da revisao manual)")

        # Regra 2: Se todas são iguais, manter apenas a primeira
        elif len(grupo) > 1:
            # Verificar se são realmente identicas
            primeiro_fornecedor = str(grupo.iloc[0]['FORNECEDOR']).upper().strip()
            primeiro_valor = grupo.iloc[0]['VLR_TOTAL']
            primeiro_data = str(grupo.iloc[0]['DATA_ORIGINAL'])

            todas_identicas = all(
                str(row['FORNECEDOR']).upper().strip() == primeiro_fornecedor and
                row['VLR_TOTAL'] == primeiro_valor and
                str(row['DATA_ORIGINAL']) == primeiro_data
                for idx, row in grupo.iterrows()
            )

            if todas_identicas:
                # Manter apenas a primeira, remover as demais
                for idx, row in grupo.iloc[1:].iterrows():
                    indices_para_remover.append(idx)
                    print(f"  -> REMOVER linha {idx+2} (duplicata identica)")
            else:
                print(f"  -> MANTER TODAS (podem ser pagamentos diferentes)")

        print("-"*80)

    # Remover duplicatas
    if len(indices_para_remover) > 0:
        print(f"\n\nTotal de linhas a remover: {len(indices_para_remover)}")
        valor_remover = df.loc[indices_para_remover, 'VLR_TOTAL'].sum()
        print(f"Valor total a remover: R$ {valor_remover:,.2f}\n")

        # Criar DataFrame sem duplicatas
        df_limpo = df.drop(indices_para_remover).reset_index(drop=True)

        linhas_final = len(df_limpo)
        valor_final = df_limpo['VLR_TOTAL'].sum()

        # Remover coluna auxiliar
        df_limpo = df_limpo.drop(columns=['CHAVE_DUPLICATA'])

        print("="*80)
        print("RESULTADO")
        print("="*80)
        print(f"\nANTES:")
        print(f"   Linhas: {linhas_inicial}")
        print(f"   Valor: R$ {valor_inicial:,.2f}")
        print(f"\nREMOVIDO:")
        print(f"   Linhas: {len(indices_para_remover)}")
        print(f"   Valor: R$ {valor_remover:,.2f}")
        print(f"\nDEPOIS:")
        print(f"   Linhas: {linhas_final}")
        print(f"   Valor: R$ {valor_final:,.2f}")
        print(f"\nDIFERENCA:")
        print(f"   Linhas: {linhas_inicial - linhas_final}")
        print(f"   Valor: R$ {valor_inicial - valor_final:,.2f}")
        print("="*80 + "\n")

        # Salvar planilha limpa
        output_file = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_LIMPO.xlsx"
        print(f"Salvando planilha limpa em {output_file}...")
        df_limpo.to_excel(output_file, index=False, sheet_name='Auditoria Gastos')
        print(f"[OK] Planilha limpa salva!\n")

        # Salvar relatorio
        with open('output/relatorio_remocao_duplicatas.txt', 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("RELATORIO DE REMOCAO DE DUPLICATAS\n")
            f.write("="*80 + "\n\n")
            f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

            f.write("--- RESUMO ---\n")
            f.write(f"Linhas antes: {linhas_inicial}\n")
            f.write(f"Linhas removidas: {len(indices_para_remover)}\n")
            f.write(f"Linhas depois: {linhas_final}\n\n")

            f.write("--- VALORES ---\n")
            f.write(f"Valor antes: R$ {valor_inicial:,.2f}\n")
            f.write(f"Valor removido: R$ {valor_remover:,.2f}\n")
            f.write(f"Valor depois: R$ {valor_final:,.2f}\n\n")

            f.write("--- LINHAS REMOVIDAS ---\n")
            for idx in indices_para_remover:
                row = df.loc[idx]
                f.write(f"Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}\n")

            f.write("\n" + "="*80 + "\n")

        print(f"[OK] Relatorio salvo: output/relatorio_remocao_duplicatas.txt\n")

        print("="*80)
        print("PROCESSO CONCLUIDO!")
        print("="*80)
        print(f"\nArquivo gerado: {output_file}")
        print(f"Linhas: {linhas_final}")
        print(f"Valor: R$ {valor_final:,.2f}\n")

    else:
        print("\n[!] Nenhuma duplicata para remover (todas devem ser mantidas)")

if __name__ == "__main__":
    main()
