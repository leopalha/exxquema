"""
Script para validar a planilha final
"""

import pandas as pd
from datetime import datetime

def main():
    print("="*80)
    print("VALIDACAO DA PLANILHA FINAL")
    print("="*80 + "\n")

    # Carregar planilha final
    print("Carregando planilha final...")
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx")
    print(f"[OK] Planilha carregada\n")

    # Estatisticas basicas
    print("="*80)
    print("ESTATISTICAS BASICAS")
    print("="*80)
    print(f"Total de linhas: {len(df)}")
    print(f"Valor total: R$ {df['VLR_TOTAL'].sum():,.2f}")
    print(f"\nLinhas adicionadas pela revisao manual: {len(df[df['STATUS_VERIFICACAO'] == 'VERIFICADO_MANUALMENTE'])}")
    print(f"Linhas originais: {len(df[df['STATUS_VERIFICACAO'] != 'VERIFICADO_MANUALMENTE'])}\n")

    # Verificar duplicatas
    print("="*80)
    print("VERIFICACAO DE DUPLICATAS")
    print("="*80)

    # Criar chave unica: fornecedor + data + valor
    df['CHAVE_DUPLICATA'] = (
        df['FORNECEDOR'].astype(str).str.upper().str.strip() + '_' +
        df['DATA_ORIGINAL'].astype(str) + '_' +
        df['VLR_TOTAL'].round(2).astype(str)
    )

    duplicatas = df[df['CHAVE_DUPLICATA'].duplicated(keep=False)]

    if len(duplicatas) > 0:
        print(f"\n[!] ATENCAO: {len(duplicatas)} linhas potencialmente duplicadas encontradas!\n")
        print("Grupos de duplicatas:\n")

        for chave in duplicatas['CHAVE_DUPLICATA'].unique():
            grupo = df[df['CHAVE_DUPLICATA'] == chave]
            print(f"\nGrupo com {len(grupo)} ocorrencias:")
            for idx, row in grupo.iterrows():
                obs = str(row.get('OBS_ORIGINAL', ''))[:30] if pd.notna(row.get('OBS_ORIGINAL', '')) else ''
                print(f"  Linha {idx+2}: {row['FORNECEDOR'][:40]:40s} | R$ {row['VLR_TOTAL']:>10,.2f} | {row['DATA_ORIGINAL']} | {obs}")
    else:
        print("[OK] Nenhuma duplicata encontrada!\n")

    # Distribuicao por categoria
    print("\n" + "="*80)
    print("DISTRIBUICAO POR CATEGORIA")
    print("="*80 + "\n")

    categorias = df.groupby('CATEGORIA').agg({
        'VLR_TOTAL': ['count', 'sum']
    }).round(2)
    categorias.columns = ['Quantidade', 'Valor Total']
    categorias = categorias.sort_values('Valor Total', ascending=False)

    for categoria, row in categorias.iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor Total']
        pct = (valor / df['VLR_TOTAL'].sum()) * 100
        print(f"{categoria:30s}: {qtd:3d} itens | R$ {valor:>12,.2f} ({pct:>5.1f}%)")

    # Verificar valores criticos
    print("\n" + "="*80)
    print("VALORES CRITICOS PARA VERIFICAR")
    print("="*80 + "\n")

    valores_altos = df[df['VLR_TOTAL'] > 1000].sort_values('VLR_TOTAL', ascending=False)

    if len(valores_altos) > 0:
        print(f"Encontrados {len(valores_altos)} itens com valor > R$ 1.000:\n")
        for idx, row in valores_altos.head(10).iterrows():
            obs = row.get('OBS_ORIGINAL', '')
            pagina = ''
            if 'Pagina PDF' in str(obs):
                pagina = str(obs).split('Pagina PDF')[1].strip()[:3]
            print(f"  {row['FORNECEDOR'][:35]:35s} | R$ {row['VLR_TOTAL']:>10,.2f} | {row['DATA_ORIGINAL']} | Pag: {pagina}")
    else:
        print("[OK] Nenhum valor critico encontrado\n")

    # Resumo final
    print("\n" + "="*80)
    print("RESUMO FINAL")
    print("="*80)
    print(f"\n  Total de linhas: {len(df)}")
    print(f"  Valor total: R$ {df['VLR_TOTAL'].sum():,.2f}")
    print(f"  Duplicatas encontradas: {len(duplicatas)}")
    print(f"  Itens > R$ 1.000: {len(valores_altos)}")
    print(f"  Categorias: {len(df['CATEGORIA'].unique())}")
    print(f"\n  Status: {'[!] REQUER ATENCAO' if len(duplicatas) > 0 else '[OK] VALIDADO'}")
    print("\n" + "="*80)

    # Salvar relatorio
    with open('output/relatorio_validacao_final.txt', 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RELATORIO DE VALIDACAO FINAL\n")
        f.write("="*80 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- ESTATISTICAS BASICAS ---\n")
        f.write(f"Total de linhas: {len(df)}\n")
        f.write(f"Valor total: R$ {df['VLR_TOTAL'].sum():,.2f}\n")
        f.write(f"Linhas da revisao manual: {len(df[df['STATUS_VERIFICACAO'] == 'VERIFICADO_MANUALMENTE'])}\n")
        f.write(f"Linhas originais: {len(df[df['STATUS_VERIFICACAO'] != 'VERIFICADO_MANUALMENTE'])}\n\n")

        f.write("--- DUPLICATAS ---\n")
        if len(duplicatas) > 0:
            f.write(f"ATENCAO: {len(duplicatas)} linhas potencialmente duplicadas!\n\n")
            for chave in duplicatas['CHAVE_DUPLICATA'].unique():
                grupo = df[df['CHAVE_DUPLICATA'] == chave]
                f.write(f"\nGrupo com {len(grupo)} ocorrencias:\n")
                for idx, row in grupo.iterrows():
                    f.write(f"  Linha {idx+2}: {row['FORNECEDOR']} | R$ {row['VLR_TOTAL']:.2f} | {row['DATA_ORIGINAL']}\n")
        else:
            f.write("Nenhuma duplicata encontrada!\n\n")

        f.write("\n--- DISTRIBUICAO POR CATEGORIA ---\n")
        for categoria, row in categorias.iterrows():
            f.write(f"{categoria}: {int(row['Quantidade'])} itens (R$ {row['Valor Total']:,.2f})\n")

        f.write("\n--- VALORES CRITICOS (> R$ 1.000) ---\n")
        if len(valores_altos) > 0:
            for idx, row in valores_altos.iterrows():
                f.write(f"{row['FORNECEDOR']}: R$ {row['VLR_TOTAL']:,.2f} | {row['DATA_ORIGINAL']}\n")
        else:
            f.write("Nenhum valor critico encontrado\n")

        f.write("\n" + "="*80 + "\n")

    print(f"\n[OK] Relatorio salvo: output/relatorio_validacao_final.txt\n")

if __name__ == "__main__":
    main()
