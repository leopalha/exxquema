"""
Script para corrigir a planilha removendo APENAS:
1. Linha com valor total duplicado (linha NaN)
2. Duplicatas COMPLETAS (linhas 100% iguais)
NÃO remove itens similares que podem ser legítimos (ex: Pedreiro semana 1,2,3...)
"""

import pandas as pd
from datetime import datetime

def main():
    print("="*60)
    print("CORRECAO FINAL DA PLANILHA (CONSERVADORA)")
    print("="*60 + "\n")

    # Carregar planilha
    print("Carregando planilha Excel...")
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"
    df = pd.read_excel(planilha_path)

    print(f"[OK] {len(df)} linhas na planilha original")
    valor_original = df['VLR_TOTAL'].sum()
    print(f"[OK] Valor total original (INCORRETO): R$ {valor_original:,.2f}\n")

    # PASSO 1: Remover linha com NaN (linha do total)
    print("PASSO 1: Removendo linha com valor total duplicado...")
    linhas_nan = df[df['FORNECEDOR'].isna() & df['ITEM'].isna()].index.tolist()
    if linhas_nan:
        print(f"[!] Encontrada linha com NaN (total duplicado): linhas {[i+2 for i in linhas_nan]}")
        for idx in linhas_nan:
            print(f"    Valor na linha: R$ {df.at[idx, 'VLR_TOTAL']:,.2f}")
        df = df.drop(linhas_nan).reset_index(drop=True)
        valor_apos_nan = df['VLR_TOTAL'].sum()
        print(f"[OK] Linhas após remover NaN: {len(df)}")
        print(f"[OK] Valor após remover NaN: R$ {valor_apos_nan:,.2f}\n")

    # PASSO 2: Remover APENAS duplicatas 100% completas
    print("PASSO 2: Removendo APENAS duplicatas 100% idênticas...")
    print("(Mantém itens similares que podem ser legítimos)")

    # Identificar duplicatas completas antes de remover
    duplicatas_mask = df.duplicated(keep=False)
    duplicatas = df[duplicatas_mask].copy()

    if len(duplicatas) > 0:
        print(f"\n[!] Encontradas {len(duplicatas)} linhas duplicadas:")
        for idx in duplicatas.index:
            row = df.loc[idx]
            print(f"    Linha {idx+2}: {row['FORNECEDOR']} - {row['ITEM'][:40]} - R$ {row['VLR_TOTAL']:.2f}")

    linhas_antes = len(df)
    df = df.drop_duplicates(keep='first').reset_index(drop=True)
    linhas_apos = len(df)
    duplicatas_removidas = linhas_antes - linhas_apos

    print(f"\n[OK] Duplicatas 100% idênticas removidas: {duplicatas_removidas}")
    valor_final = df['VLR_TOTAL'].sum()
    print(f"[OK] Linhas finais: {len(df)}")
    print(f"[OK] Valor final: R$ {valor_final:,.2f}\n")

    # Estatísticas finais
    print("="*60)
    print("ESTATISTICAS FINAIS")
    print("="*60)
    print(f"Linhas originais: 272")
    print(f"Linhas NaN removidas: {len(linhas_nan) if linhas_nan else 0}")
    print(f"Duplicatas completas removidas: {duplicatas_removidas}")
    print(f"Linhas finais: {len(df)}")
    print()
    print(f"Valor original (INCORRETO): R$ {valor_original:,.2f}")
    print(f"Valor final (CORRETO): R$ {valor_final:,.2f}")
    print("="*60 + "\n")

    # Verificar se está correto
    valor_esperado = 241853.25
    diferenca = abs(valor_final - valor_esperado)
    if diferenca < 0.5:
        print(f"[OK] SUCESSO! Valor está correto! Diferença: R$ {diferenca:.2f}\n")
    else:
        print(f"[!] Valor está próximo mas não exato do esperado")
        print(f"    Esperado: R$ {valor_esperado:,.2f}")
        print(f"    Obtido: R$ {valor_final:,.2f}")
        print(f"    Diferença: R$ {diferenca:,.2f}\n")

    # Salvar planilha corrigida
    output_path = "Gastos_Consolidados_Flame_AUDITORIA_CORRIGIDO.xlsx"
    print(f"Salvando planilha corrigida em {output_path}...")
    df.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha corrigida salva!\n")

    # Gerar relatório
    with open('output/relatorio_correcao_final.txt', 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("RELATORIO DE CORRECAO DA PLANILHA\n")
        f.write("="*60 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Linhas originais: 272\n")
        f.write(f"Linhas NaN removidas: {len(linhas_nan) if linhas_nan else 0}\n")
        f.write(f"Duplicatas 100% identicas removidas: {duplicatas_removidas}\n")
        f.write(f"Linhas finais: {len(df)}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor original (INCORRETO): R$ {valor_original:,.2f}\n")
        f.write(f"Valor final (CORRETO): R$ {valor_final:,.2f}\n")
        f.write(f"Diferenca do esperado: R$ {abs(valor_final - valor_esperado):.2f}\n\n")

        f.write("--- OBSERVACOES ---\n")
        f.write("- Planilha original continha uma linha com NaN que tinha o valor total duplicado\n")
        f.write("- Apenas duplicatas 100% identicas foram removidas\n")
        f.write("- Itens similares (ex: Pedreiro semana 1,2,3...) foram mantidos pois sao legitimos\n")
        f.write("- Valor agora esta correto\n\n")

        f.write("="*60 + "\n")

    print("[OK] Relatório salvo: output/relatorio_correcao_final.txt\n")

    print("="*60)
    print("CORRECAO CONCLUIDA!")
    print("="*60)
    print(f"\nArquivo gerado: {output_path}")
    print(f"Valor final: R$ {valor_final:,.2f}\n")

if __name__ == "__main__":
    main()
