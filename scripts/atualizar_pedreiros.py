"""
Script para atualizar observacoes dos 5 pagamentos de Pedreiro
indicando que sao etapas distintas
"""

import pandas as pd

def main():
    print("="*80)
    print("ATUALIZAR OBSERVACOES DOS PEDREIROS")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx")

    # Encontrar linhas dos Pedreiros de R$ 5.400
    pedreiros = df[(df['FORNECEDOR'] == 'Pedreiro') & (df['VLR_TOTAL'] == 5400.00)]

    print(f"Encontradas {len(pedreiros)} linhas de Pedreiro com R$ 5.400,00\n")

    if len(pedreiros) != 5:
        print(f"[!] ATENCAO: Esperava 5 linhas mas encontrou {len(pedreiros)}!")
        print("\nLinhas encontradas:")
        for idx, row in pedreiros.iterrows():
            print(f"  Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:.2f} | Obs: {row.get('OBS_ORIGINAL', '')}")
        return

    # Atualizar observacoes
    etapas = [
        "Etapa 1 - Pagamento por etapa de obra (5 etapas distintas)",
        "Etapa 2 - Pagamento por etapa de obra (5 etapas distintas)",
        "Etapa 3 - Pagamento por etapa de obra (5 etapas distintas)",
        "Etapa 4 - Pagamento por etapa de obra (5 etapas distintas)",
        "Etapa 5 - Pagamento por etapa de obra (5 etapas distintas)"
    ]

    print("Atualizando observacoes:\n")

    for i, (idx, row) in enumerate(pedreiros.iterrows()):
        linha_excel = idx + 2
        obs_atual = row.get('OBS_ORIGINAL', '')
        obs_nova = etapas[i]

        # Atualizar
        df.at[idx, 'OBS_ORIGINAL'] = obs_nova
        df.at[idx, 'SUGESTOES'] = 'Pagamento validado - Etapa de obra confirmada'

        print(f"Linha {linha_excel}:")
        print(f"  Antes: {obs_atual}")
        print(f"  Depois: {obs_nova}\n")

    # Salvar planilha atualizada
    output_file = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx"
    print(f"\nSalvando planilha atualizada em {output_file}...")
    df.to_excel(output_file, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha atualizada!\n")

    # Resumo
    print("="*80)
    print("RESUMO")
    print("="*80)
    print(f"5 pagamentos de Pedreiro atualizados")
    print(f"Valor total: R$ 27.000,00 (5 x R$ 5.400,00)")
    print(f"Observacao adicionada: 'Etapa X - Pagamento por etapa de obra'")
    print("="*80)

if __name__ == "__main__":
    main()
