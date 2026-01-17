"""
Script para unificar e padronizar categorias
Resolver duplicatas como "Material de Construção" vs "Material de Construcao"
"""

import pandas as pd

def main():
    print("="*80)
    print("UNIFICACAO E PADRONIZACAO DE CATEGORIAS")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_FINAL_PADRONIZADO.xlsx")

    print(f"Planilha carregada: {len(df)} linhas\n")

    # Mapa de unificacao de categorias
    mapa_categorias = {
        # Material de Construcao (unificar todas as variacoes)
        'Material de Constru��o': 'Material de Construcao',
        'Material de Construção': 'Material de Construcao',
        'Material': 'Material de Construcao',

        # Mao de Obra (unificar)
        'M�o de Obra': 'Servico - Mao de Obra',
        'Mão de Obra': 'Servico - Mao de Obra',
        'Servi�o': 'Servico - Mao de Obra',
        'Servico': 'Servico - Mao de Obra',
        'Projeto/Servi�o': 'Servico - Profissional',

        # Material Eletrico
        'Material El�trico': 'Material Eletrico',
        'Material Elétrico': 'Material Eletrico',
        'Instala��o El�trica': 'Material Eletrico',

        # Equipamentos (unificar)
        'Equipamentos': 'Equipamento',

        # Serralheria (unificar)
        'Serralheria': 'Serralheria/Inox',

        # Limpeza (unificar)
        'Limpeza/Descart�veis': 'Material de Limpeza',
        'Limpeza/Descartaveis': 'Material de Limpeza',
        'Higiene/Limpeza': 'Material de Limpeza',

        # Descartaveis
        'Descartavel': 'Descartavel',

        # Alimentacao
        'Alimenta��o': 'Alimento',
        'Alimentação': 'Alimento',
        'Alimenta��o/Churrasco': 'Alimento',

        # Bebidas
        'Bebidas': 'Bebida',

        # Utilidade Publica
        'Utilidade P�blica': 'Utilidade Publica',

        # Escritorio
        'Escrit�rio': 'Escritorio',

        # Bazar/Limpeza
        'Bazar/Limpeza': 'Material de Limpeza',

        # Servicos/Equipamentos
        'Servicos/Equipamentos': 'Equipamento',

        # A Categorizar
        'A CATEGORIZAR': 'A Categorizar',

        # Licenciamento
        'Licenciamento': 'Licenciamento',

        # Frete
        'Frete': 'Frete/Transporte'
    }

    # Aplicar mapa
    print("Unificando categorias...")
    df['CATEGORIA'] = df['CATEGORIA'].replace(mapa_categorias)

    # Contar categorias finais
    print("\n[OK] Categorias unificadas!\n")

    print("="*80)
    print("DISTRIBUICAO FINAL POR CATEGORIA")
    print("="*80 + "\n")

    categorias = df.groupby('CATEGORIA').agg({
        'VLR_TOTAL': ['count', 'sum']
    }).round(2)
    categorias.columns = ['Quantidade', 'Valor Total']
    categorias = categorias.sort_values('Valor Total', ascending=False)

    valor_total = df['VLR_TOTAL'].sum()

    print(f"{'Categoria':35s} | {'Qtd':>4s} | {'Valor':>14s} | {'%':>6s}")
    print("-"*80)

    for cat, row in categorias.iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor Total']
        perc = (valor / valor_total * 100)
        print(f"{cat:35s} | {qtd:>4} | R$ {valor:>12,.2f} | {perc:>5.1f}%")

    print("-"*80)
    print(f"{'TOTAL':35s} | {len(df):>4} | R$ {valor_total:>12,.2f} | 100.0%")
    print("="*80 + "\n")

    # Salvar
    output_file = "Gastos_Consolidados_Flame_FINAL_PADRONIZADO.xlsx"
    print(f"Salvando planilha atualizada: {output_file}...")
    df.to_excel(output_file, index=False, sheet_name='Gastos Flame')
    print(f"[OK] Planilha salva!\n")

    print("="*80)
    print("RESUMO FINAL")
    print("="*80)
    print(f"""
ARQUIVO: {output_file}
TOTAL: {len(df)} linhas | R$ {valor_total:,.2f}
CATEGORIAS: {len(categorias)} categorias unificadas

VALOR REAL CORRETO: R$ {valor_total:.2f}

TOP 5 CATEGORIAS:
""")

    for cat, row in categorias.head(5).iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor Total']
        perc = (valor / valor_total * 100)
        print(f"  {cat:35s}: R$ {valor:>12,.2f} ({perc:>4.1f}%)")

    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()
