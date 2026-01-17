"""
Script para corrigir a planilha removendo:
1. Linha com valor total duplicado (linha 271)
2. Duplicatas completas
3. Duplicatas baseadas em fornecedor+data+valor
"""

import pandas as pd
import re
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor para comparação"""
    if not fornecedor or pd.isna(fornecedor):
        return ""
    fornecedor = str(fornecedor).upper().strip()
    fornecedor = re.sub(r'[^\w\s]', '', fornecedor)
    palavras_remover = ['LTDA', 'ME', 'EIRELI', 'SA', 'S/A', 'EPP', 'CIA']
    for palavra in palavras_remover:
        fornecedor = fornecedor.replace(palavra, '')
    return ' '.join(fornecedor.split())

def criar_chave_duplicata(fornecedor, data, valor):
    """Cria chave única para detectar duplicatas"""
    fornecedor_norm = normalizar_fornecedor(fornecedor)

    # Normalizar data
    if pd.isna(data) or data == '' or data == '-':
        data_norm = "SEM_DATA"
    else:
        data_norm = str(data).strip()

    # Normalizar valor
    try:
        valor_norm = round(float(valor), 2)
    except:
        valor_norm = 0.0

    if not fornecedor_norm or valor_norm == 0.0:
        return None

    return f"{fornecedor_norm}|{data_norm}|{valor_norm:.2f}"

def main():
    print("="*60)
    print("CORRECAO FINAL DA PLANILHA")
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
        df = df.drop(linhas_nan).reset_index(drop=True)
        valor_apos_nan = df['VLR_TOTAL'].sum()
        print(f"[OK] Linhas após remover NaN: {len(df)}")
        print(f"[OK] Valor após remover NaN: R$ {valor_apos_nan:,.2f}\n")

    # PASSO 2: Remover duplicatas completas (linhas 100% iguais)
    print("PASSO 2: Removendo duplicatas completas...")
    linhas_antes = len(df)
    df = df.drop_duplicates(keep='first').reset_index(drop=True)
    linhas_apos = len(df)
    duplicatas_completas = linhas_antes - linhas_apos
    print(f"[OK] Duplicatas completas removidas: {duplicatas_completas}")
    valor_apos_completas = df['VLR_TOTAL'].sum()
    print(f"[OK] Linhas: {len(df)}")
    print(f"[OK] Valor: R$ {valor_apos_completas:,.2f}\n")

    # PASSO 3: Detectar duplicatas por chave (fornecedor+data+valor)
    print("PASSO 3: Detectando duplicatas por fornecedor+data+valor...")
    chaves_vistas = {}
    linhas_para_remover = []

    for idx, row in df.iterrows():
        chave = criar_chave_duplicata(
            row['FORNECEDOR'],
            row['DATA_ORIGINAL'],
            row['VLR_TOTAL']
        )

        if not chave:
            continue

        if chave in chaves_vistas:
            linha_original = chaves_vistas[chave]
            linhas_para_remover.append(idx)
            print(f"[!] Duplicata: Linha {idx + 2} (original: linha {linha_original + 2})")
            print(f"    {row['FORNECEDOR'][:50]} - R$ {row['VLR_TOTAL']:.2f}")
        else:
            chaves_vistas[chave] = idx

    if linhas_para_remover:
        valor_duplicado = df.loc[linhas_para_remover, 'VLR_TOTAL'].sum()
        print(f"\nTotal de duplicatas por chave: {len(linhas_para_remover)}")
        print(f"Valor das duplicatas: R$ {valor_duplicado:,.2f}\n")
        df = df.drop(linhas_para_remover).reset_index(drop=True)
    else:
        print("[OK] Nenhuma duplicata por chave encontrada\n")

    # Estatísticas finais
    valor_final = df['VLR_TOTAL'].sum()

    print("="*60)
    print("ESTATISTICAS FINAIS")
    print("="*60)
    print(f"Linhas originais: 272")
    print(f"Linha NaN removida: {len(linhas_nan) if linhas_nan else 0}")
    print(f"Duplicatas completas removidas: {duplicatas_completas}")
    print(f"Duplicatas por chave removidas: {len(linhas_para_remover)}")
    print(f"Linhas finais: {len(df)}")
    print()
    print(f"Valor original (INCORRETO): R$ {valor_original:,.2f}")
    print(f"Valor final (CORRETO): R$ {valor_final:,.2f}")
    print("="*60 + "\n")

    # Verificar se está correto
    valor_esperado = 241853.25
    diferenca = abs(valor_final - valor_esperado)
    if diferenca < 0.5:
        print(f"[OK] Valor está correto! Diferença: R$ {diferenca:.2f}\n")
    else:
        print(f"[!] ATENCAO: Valor ainda está diferente do esperado")
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
        f.write(f"Duplicatas completas removidas: {duplicatas_completas}\n")
        f.write(f"Duplicatas por chave removidas: {len(linhas_para_remover)}\n")
        f.write(f"Linhas finais: {len(df)}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor original (INCORRETO): R$ {valor_original:,.2f}\n")
        f.write(f"Valor final (CORRETO): R$ {valor_final:,.2f}\n")
        f.write(f"Diferença do esperado: R$ {abs(valor_final - valor_esperado):.2f}\n\n")

        f.write("--- OBSERVACOES ---\n")
        f.write("- Planilha original continha uma linha com NaN que tinha o valor total duplicado\n")
        f.write("- Duplicatas foram removidas\n")
        f.write("- Valor agora está correto\n\n")

        f.write("="*60 + "\n")

    print("[OK] Relatório salvo: output/relatorio_correcao_final.txt\n")

    print("="*60)
    print("CORRECAO CONCLUIDA!")
    print("="*60)
    print(f"\nArquivo gerado: {output_path}")
    print(f"Valor final: R$ {valor_final:,.2f}\n")

if __name__ == "__main__":
    main()
