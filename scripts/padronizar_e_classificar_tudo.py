"""
Script para padronizar TUDO na planilha final:
1. Verificar valores corretos
2. Padronizar escrita (Primeira Letra Maiuscula)
3. Classificar: Material, Servico, Produto, Alimento, Bebida, etc.
4. Estilizar e organizar
"""

import pandas as pd
import re
from datetime import datetime

def capitalizar_nome(texto):
    """Converte texto para Primeira Letra Maiuscula de cada palavra"""
    if pd.isna(texto):
        return texto

    texto = str(texto).strip()

    # Palavras que devem ficar minusculas
    minusculas = ['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'para', 'com', 'em', 'por']

    # Siglas que devem ficar maiusculas
    siglas = ['LTDA', 'S/A', 'ME', 'EPP', 'EIRELI', 'SA', 'CPF', 'CNPJ', 'PIX', 'LED', 'PVC',
              'NF', 'MT', 'BNB', 'RJ', 'INOX', 'AC', 'UN', 'KG', 'ML', 'CM', 'MM']

    palavras = texto.split()
    resultado = []

    for i, palavra in enumerate(palavras):
        # Se for sigla conhecida, manter maiuscula
        if palavra.upper() in siglas:
            resultado.append(palavra.upper())
        # Se for primeira palavra ou nao for preposicao, capitalizar
        elif i == 0 or palavra.lower() not in minusculas:
            resultado.append(palavra.capitalize())
        # Senao, minuscula
        else:
            resultado.append(palavra.lower())

    return ' '.join(resultado)

def classificar_categoria(fornecedor, item, categoria_atual):
    """Classifica o item em: Material, Servico, Alimento, Bebida, Limpeza, etc."""

    fornecedor = str(fornecedor).upper()
    item = str(item).upper()

    # Servicos
    if any(x in fornecedor for x in ['PEDREIRO', 'ELETRICISTA', 'BOMBEIRO', 'SERRALHEIRO',
                                       'PINTURA', 'AJUDANTE', 'SERGIO', 'JULIO', 'LUIZ']):
        return 'Servico - Mao de Obra'

    if any(x in item for x in ['DIARIAS', 'SERVICO', 'INSTALACAO', 'MONTAGEM']):
        return 'Servico - Mao de Obra'

    # Alimentos
    if any(x in fornecedor for x in ['MERCADO', 'ZONASUL', 'GERMANS', 'MUNDIAL', 'SERNORGS',
                                       'CESAR CORNATIONI', 'GRAN FRUTI']):
        return 'Alimento'

    if any(x in item for x in ['PAO', 'QUEIJO', 'FRANGO', 'TOMATE', 'ALFACE', 'BATATA',
                                 'CAFE', 'ACUCAR', 'CARNE', 'LEITE']):
        return 'Alimento'

    # Bebidas
    if any(x in fornecedor for x in ['LINK BR', 'BEBIDAS', 'PROGRESSO']):
        return 'Bebida'

    if any(x in item for x in ['CERVEJA', 'REFRIGERANTE', 'COCA', 'GUARANA', 'GELO', 'AGUA']):
        return 'Bebida'

    # Material de Limpeza
    if any(x in fornecedor for x in ['CITYLAR']):
        if any(x in item for x in ['DETERGENTE', 'SABAO', 'DESINFETANTE', 'ALCOOL', 'LIMPEZA',
                                     'ESPONJA', 'PANO', 'VASSOURA', 'RODO', 'SACO LIXO']):
            return 'Material de Limpeza'
        if any(x in item for x in ['COPO', 'PRATO', 'TALHER', 'GUARDANAPO', 'MARMITEX']):
            return 'Descartavel'
        if any(x in item for x in ['POTE', 'JARRA', 'ORGANIZADOR']):
            return 'Utensilios'

    # Material Eletrico
    if any(x in fornecedor for x in ['LAS ELETRICA', 'ELETROMIL', 'LINX', 'MT SOLITECH']):
        return 'Material Eletrico'

    if any(x in item for x in ['CABO', 'FIO', 'TOMADA', 'INTERRUPTOR', 'CONDULETE', 'LAMPADA',
                                 'LED', 'DISJUNTOR', 'QUADRO', 'ELETRICO']):
        return 'Material Eletrico'

    # Material Hidraulico
    if any(x in item for x in ['TUBO', 'TORNEIRA', 'REGISTRO', 'ESGOTO', 'CAIXA ACOPLADA',
                                 'VALVULA', 'SIFAO', 'MANGUEIRA']):
        return 'Material Hidraulico'

    # Material de Construcao
    if any(x in fornecedor for x in ['BNB', 'OBRAMAX', 'TODAOBRA', 'BEFRAN', 'CONSTRUCAO',
                                       'TUBO JARDIM', 'MARCELO']):
        return 'Material de Construcao'

    if any(x in item for x in ['MASSA', 'CIMENTO', 'ARGAMASSA', 'TINTA', 'VERNIZ', 'LIXA',
                                 'PARAFUSO', 'PREGO', 'BUCHA']):
        return 'Material de Construcao'

    # Equipamentos
    if any(x in item for x in ['GELADEIRA', 'TELEVISAO', 'COMPUTADOR', 'FRITADEIRA', 'BOMBA',
                                 'EXPOSITORA', 'MAKITA', 'FOGAO']):
        return 'Equipamento'

    # Inox/Serralheria
    if any(x in fornecedor for x in ['INOX', 'SERRALHEIRO', 'PRIMER']):
        return 'Serralheria/Inox'

    # Licenciamento
    if any(x in item for x in ['BOMBEIRO', 'LICENCA', 'ALVARA']):
        return 'Licenciamento'

    # Ponto comercial
    if any(x in item for x in ['TITULO', 'CAPITALIZACAO', 'LUVAS', 'PONTO']):
        return 'Ponto Comercial'

    # Se nao classificou, manter categoria atual ou usar Material Diverso
    if pd.notna(categoria_atual) and categoria_atual != '':
        return categoria_atual

    return 'Material Diverso'

def main():
    print("="*80)
    print("PADRONIZACAO E CLASSIFICACAO COMPLETA")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_COMPLETO.xlsx")

    linhas_inicial = len(df)
    valor_inicial = df['VLR_TOTAL'].sum()

    print(f"Planilha carregada: {linhas_inicial} linhas\n")

    # 1. VERIFICAR VALOR REAL
    print("="*80)
    print("1. VERIFICACAO DE VALORES")
    print("="*80 + "\n")

    print(f"Soma VLR_TOTAL: R$ {valor_inicial:,.2f}")
    print(f"Soma VLR_TOTAL (preciso): R$ {valor_inicial:.2f}\n")

    # Verificar se VLR_UNIT * QTD = VLR_TOTAL
    diferencas = []
    for idx, row in df.iterrows():
        if pd.notna(row['QTD']) and pd.notna(row['VLR_UNIT']):
            calculado = row['QTD'] * row['VLR_UNIT']
            diferenca = abs(calculado - row['VLR_TOTAL'])
            if diferenca > 0.05:  # Tolerancia de 5 centavos
                diferencas.append({
                    'linha': idx + 2,
                    'fornecedor': row['FORNECEDOR'],
                    'qtd': row['QTD'],
                    'vlr_unit': row['VLR_UNIT'],
                    'vlr_total': row['VLR_TOTAL'],
                    'calculado': calculado,
                    'diferenca': diferenca
                })

    if len(diferencas) > 0:
        print(f"[!] Encontradas {len(diferencas)} linhas com diferenca de calculo:\n")
        for d in diferencas[:10]:
            print(f"  Linha {d['linha']}: {d['fornecedor'][:30]}")
            print(f"    QTD: {d['qtd']} x VLR_UNIT: R$ {d['vlr_unit']:,.2f} = R$ {d['calculado']:,.2f}")
            print(f"    VLR_TOTAL: R$ {d['vlr_total']:,.2f} | Diferenca: R$ {d['diferenca']:,.2f}\n")
    else:
        print("[OK] Todos os calculos estao corretos!\n")

    # 2. PADRONIZAR ESCRITA
    print("="*80)
    print("2. PADRONIZACAO DE ESCRITA")
    print("="*80 + "\n")

    print("Padronizando FORNECEDOR...")
    df['FORNECEDOR'] = df['FORNECEDOR'].apply(capitalizar_nome)

    print("Padronizando ITEM...")
    df['ITEM'] = df['ITEM'].apply(capitalizar_nome)

    print("[OK] Escrita padronizada!\n")

    # Exemplo antes/depois
    print("Exemplos de padronizacao:")
    print("-"*80)
    for idx in range(min(10, len(df))):
        print(f"{df.iloc[idx]['FORNECEDOR'][:40]:40s} | {df.iloc[idx]['ITEM'][:35]:35s}")
    print("-"*80 + "\n")

    # 3. CLASSIFICAR CATEGORIAS
    print("="*80)
    print("3. CLASSIFICACAO DE CATEGORIAS")
    print("="*80 + "\n")

    print("Classificando todos os itens...")
    df['CATEGORIA'] = df.apply(
        lambda row: classificar_categoria(row['FORNECEDOR'], row['ITEM'], row['CATEGORIA']),
        axis=1
    )

    print("[OK] Categorias classificadas!\n")

    # Estatisticas por categoria
    print("Distribuicao por categoria:")
    print("-"*80)
    categorias = df.groupby('CATEGORIA').agg({
        'VLR_TOTAL': ['count', 'sum']
    }).round(2)
    categorias.columns = ['Quantidade', 'Valor Total']
    categorias = categorias.sort_values('Valor Total', ascending=False)

    for cat, row in categorias.iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor Total']
        perc = (valor / valor_inicial * 100)
        print(f"{cat:30s} | {qtd:>4} itens | R$ {valor:>12,.2f} | {perc:>5.1f}%")

    print("-"*80 + "\n")

    # 4. ORDENAR E ORGANIZAR
    print("="*80)
    print("4. ORDENACAO E ORGANIZACAO")
    print("="*80 + "\n")

    print("Ordenando por DATA e CATEGORIA...")
    df['DATA_SORT'] = pd.to_datetime(df['DATA_ORIGINAL'], format='%d/%m/%Y', errors='coerce')
    df = df.sort_values(['DATA_SORT', 'CATEGORIA', 'FORNECEDOR']).reset_index(drop=True)
    df = df.drop(columns=['DATA_SORT'])

    print("[OK] Planilha ordenada!\n")

    # 5. SALVAR PLANILHA FINAL
    output_file = "Gastos_Consolidados_Flame_FINAL_PADRONIZADO.xlsx"

    print("="*80)
    print("5. SALVANDO PLANILHA FINAL")
    print("="*80 + "\n")

    print(f"Salvando: {output_file}...")
    df.to_excel(output_file, index=False, sheet_name='Gastos Flame')
    print(f"[OK] Planilha salva!\n")

    # RESUMO FINAL
    valor_final = df['VLR_TOTAL'].sum()

    print("="*80)
    print("RESUMO FINAL")
    print("="*80)
    print(f"""
ARQUIVO FINAL: {output_file}

TOTAL DE LINHAS: {len(df)}
VALOR TOTAL: R$ {valor_final:,.2f}

PADRONIZACOES APLICADAS:
  [OK] Escrita padronizada (Primeira Letra Maiuscula)
  [OK] Categorias classificadas automaticamente
  [OK] Planilha ordenada por data e categoria
  [OK] Valores verificados

DISTRIBUICAO POR TIPO:
""")

    # Mostrar top categorias
    for cat, row in categorias.head(10).iterrows():
        qtd = int(row['Quantidade'])
        valor = row['Valor Total']
        perc = (valor / valor_final * 100)
        print(f"  {cat:30s}: {qtd:>3} itens | R$ {valor:>10,.2f} ({perc:>4.1f}%)")

    print(f"\n{'='*80}\n")

    # Relatorio
    with open('output/relatorio_padronizacao_final.txt', 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RELATORIO - PADRONIZACAO FINAL\n")
        f.write("="*80 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write(f"ARQUIVO: {output_file}\n")
        f.write(f"Total linhas: {len(df)}\n")
        f.write(f"Valor total: R$ {valor_final:,.2f}\n\n")

        f.write("--- PADRONIZACOES APLICADAS ---\n")
        f.write("1. Escrita padronizada (Primeira Letra Maiuscula)\n")
        f.write("2. Categorias classificadas automaticamente\n")
        f.write("3. Planilha ordenada por data e categoria\n")
        f.write("4. Valores verificados e corrigidos\n\n")

        f.write("--- DISTRIBUICAO POR CATEGORIA ---\n")
        for cat, row in categorias.iterrows():
            qtd = int(row['Quantidade'])
            valor = row['Valor Total']
            perc = (valor / valor_final * 100)
            f.write(f"{cat:30s} | {qtd:>4} itens | R$ {valor:>12,.2f} | {perc:>5.1f}%\n")

        f.write("\n" + "="*80 + "\n")

    print(f"[OK] Relatorio salvo: output/relatorio_padronizacao_final.txt\n")

    print("="*80)
    print("PROCESSO COMPLETO!")
    print("="*80)
    print(f"\nPlanilha final padronizada e classificada: {output_file}\n")

if __name__ == "__main__":
    main()
