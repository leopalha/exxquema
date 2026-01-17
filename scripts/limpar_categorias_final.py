# -*- coding: utf-8 -*-
"""
Script para limpar TODAS as categorias com caracteres especiais
"""

import pandas as pd
import unicodedata

def remover_acentos(texto):
    """Remove acentos de um texto"""
    if pd.isna(texto):
        return texto
    # Normalizar e remover acentos
    nfkd = unicodedata.normalize('NFKD', str(texto))
    return ''.join([c for c in nfkd if not unicodedata.combining(c)])

def main():
    print("="*80)
    print("LIMPEZA FINAL DE CATEGORIAS")
    print("="*80 + "\n")

    # Carregar
    df = pd.read_excel("Gastos_Consolidados_Flame_FINAL_PADRONIZADO.xlsx")

    print(f"Planilha carregada: {len(df)} linhas\n")

    # Categorias unicas antes
    cats_antes = df['CATEGORIA'].unique()
    print(f"Categorias antes: {len(cats_antes)}")
    for cat in sorted(cats_antes):
        qtd = len(df[df['CATEGORIA'] == cat])
        print(f"  - {cat} ({qtd} itens)")

    print("\n" + "-"*80 + "\n")

    # Mapa de limpeza DEFINITIVO
    mapa_final = {}

    for cat in cats_antes:
        cat_limpa = remover_acentos(cat)

        # Aplicar regras especificas
        if 'Servico' in cat_limpa or 'Mao de Obra' in cat_limpa:
            mapa_final[cat] = 'Servico - Mao de Obra'
        elif 'Projeto' in cat_limpa or 'Profissional' in cat_limpa:
            mapa_final[cat] = 'Servico - Profissional'
        elif 'Instalacao' in cat_limpa and 'Eletrica' in cat_limpa:
            mapa_final[cat] = 'Material Eletrico'
        elif 'Utilidade' in cat_limpa:
            mapa_final[cat] = 'Utilidade Publica'
        elif 'Limpeza' in cat_limpa and 'Descartaveis' in cat_limpa:
            mapa_final[cat] = 'Material de Limpeza'
        elif 'Alimentacao' in cat_limpa:
            mapa_final[cat] = 'Alimento'
        elif 'Escritorio' in cat_limpa:
            mapa_final[cat] = 'Escritorio'
        else:
            # Manter mas sem acentos
            mapa_final[cat] = cat_limpa

    # Aplicar mapa
    print("Aplicando limpeza...")
    df['CATEGORIA'] = df['CATEGORIA'].map(mapa_final)

    # Categorias unicas depois
    cats_depois = df['CATEGORIA'].unique()
    print(f"\n[OK] Categorias depois: {len(cats_depois)}\n")

    # Estatisticas finais
    print("="*80)
    print("DISTRIBUICAO FINAL")
    print("="*80 + "\n")

    categorias = df.groupby('CATEGORIA').agg({
        'VLR_TOTAL': ['count', 'sum']
    }).round(2)
    categorias.columns = ['Quantidade', 'Valor']
    categorias = categorias.sort_values('Valor', ascending=False)

    valor_total = df['VLR_TOTAL'].sum()

    print(f"{'Categoria':40s} | {'Qtd':>4s} | {'Valor (R$)':>15s} | {'%':>6s}")
    print("-"*80)

    for cat, row in categorias.iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor']
        perc = (valor / valor_total * 100)
        print(f"{cat:40s} | {qtd:>4} | {valor:>15,.2f} | {perc:>5.1f}%")

    print("-"*80)
    print(f"{'TOTAL':40s} | {len(df):>4} | {valor_total:>15,.2f} | 100.0%")
    print("="*80 + "\n")

    # Salvar
    output_file = "Gastos_Consolidados_Flame_FINAL_PADRONIZADO.xlsx"
    print(f"Salvando: {output_file}...")
    df.to_excel(output_file, index=False, sheet_name='Gastos Flame')
    print(f"[OK] Salvo!\n")

    print("="*80)
    print("VALOR TOTAL CORRETO")
    print("="*80)
    print(f"\nR$ {valor_total:.2f}\n")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
