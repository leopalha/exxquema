"""
Script para limpar e organizar a planilha existente
Foco: remover duplicatas, identificar problemas, completar dados
"""

import pandas as pd
import re
from pathlib import Path
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor"""
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

def analisar_planilha(df):
    """Analisa planilha e identifica problemas"""
    print("\n" + "="*60)
    print("ANALISE DA PLANILHA")
    print("="*60 + "\n")

    total_linhas = len(df)
    print(f"Total de linhas: {total_linhas}")

    # Estatísticas de dados faltantes
    print(f"\n--- DADOS FALTANTES ---")
    sem_data = df[df['DATA_ORIGINAL'].isna() | (df['DATA_ORIGINAL'] == '') | (df['DATA_ORIGINAL'] == '-')].shape[0]
    print(f"Sem data: {sem_data} ({sem_data/total_linhas*100:.1f}%)")

    fornecedor_generico = df[df['FORNECEDOR'].isin(['Fornecedor', 'N\u00e3o identificado', ''])].shape[0]
    print(f"Fornecedor generico: {fornecedor_generico} ({fornecedor_generico/total_linhas*100:.1f}%)")

    sem_categoria = df[df['CATEGORIA'].isna() | (df['CATEGORIA'] == '')].shape[0]
    print(f"Sem categoria: {sem_categoria}")

    # Distribuição por categoria
    print(f"\n--- DISTRIBUICAO POR CATEGORIA ---")
    categoria_counts = df['CATEGORIA'].value_counts()
    for cat, count in categoria_counts.head(10).items():
        print(f"{cat}: {count} itens")

    # Valor total
    print(f"\n--- VALORES ---")
    valor_total = df['VLR_TOTAL'].sum()
    print(f"Valor total: R$ {valor_total:,.2f}")
    valor_medio = df['VLR_TOTAL'].mean()
    print(f"Valor medio: R$ {valor_medio:,.2f}")

    return {
        'total_linhas': total_linhas,
        'sem_data': sem_data,
        'fornecedor_generico': fornecedor_generico,
        'valor_total': valor_total
    }

def detectar_duplicatas(df):
    """Detecta duplicatas na planilha"""
    print("\n" + "="*60)
    print("DETECCAO DE DUPLICATAS")
    print("="*60 + "\n")

    chaves_vistas = {}
    duplicatas = []

    for idx, row in df.iterrows():
        chave = criar_chave_duplicata(
            row['FORNECEDOR'],
            row['DATA_ORIGINAL'],
            row['VLR_TOTAL']
        )

        if not chave:
            continue

        if chave in chaves_vistas:
            # Encontrou duplicata
            linha_original = chaves_vistas[chave]
            duplicatas.append({
                'linha_1': linha_original + 2,
                'linha_2': idx + 2,
                'fornecedor': row['FORNECEDOR'],
                'data': row['DATA_ORIGINAL'],
                'valor': row['VLR_TOTAL'],
                'item': row['ITEM']
            })
            print(f"Duplicata: Linhas {linha_original + 2} e {idx + 2}")
            print(f"  Fornecedor: {row['FORNECEDOR']}")
            print(f"  Valor: R$ {row['VLR_TOTAL']:.2f}")
            print()
        else:
            chaves_vistas[chave] = idx

    print(f"Total de duplicatas encontradas: {len(duplicatas)}")
    return duplicatas

def identificar_itens_manuais(df):
    """Identifica itens possivelmente escritos à mão"""
    print("\n" + "="*60)
    print("ITENS POSSIVELMENTE ESCRITOS A MAO")
    print("="*60 + "\n")

    itens_mao = []

    for idx, row in df.iterrows():
        suspeito = False
        motivos = []

        # Sem data
        if pd.isna(row['DATA_ORIGINAL']) or row['DATA_ORIGINAL'] == '' or row['DATA_ORIGINAL'] == '-':
            suspeito = True
            motivos.append("SEM_DATA")

        # Fornecedor genérico
        if str(row['FORNECEDOR']).lower() in ['fornecedor', 'nao identificado', '']:
            suspeito = True
            motivos.append("FORNECEDOR_GENERICO")

        if suspeito:
            itens_mao.append({
                'linha': idx + 2,
                'categoria': row['CATEGORIA'],
                'fornecedor': row['FORNECEDOR'],
                'item': row['ITEM'],
                'valor': row['VLR_TOTAL'],
                'motivos': motivos
            })

    print(f"Total de itens suspeitos: {len(itens_mao)}")
    for item in itens_mao[:20]:
        print(f"Linha {item['linha']}: {item['item']} - {', '.join(item['motivos'])}")

    return itens_mao

def limpar_e_organizar(df, duplicatas, itens_mao):
    """Limpa e organiza a planilha"""
    print("\n" + "="*60)
    print("LIMPEZA E ORGANIZACAO")
    print("="*60 + "\n")

    df_limpo = df.copy()

    # Adicionar novas colunas se não existirem
    if 'POSSIVEL_DUPLICATA' not in df_limpo.columns:
        df_limpo['POSSIVEL_DUPLICATA'] = False
    if 'ITEM_MANUAL' not in df_limpo.columns:
        df_limpo['ITEM_MANUAL'] = False
    if 'ALERTAS' not in df_limpo.columns:
        df_limpo['ALERTAS'] = ''

    # Marcar duplicatas
    linhas_duplicadas = set()
    for dup in duplicatas:
        linhas_duplicadas.add(dup['linha_1'] - 2)  # -2 para converter para índice
        linhas_duplicadas.add(dup['linha_2'] - 2)

    for idx in linhas_duplicadas:
        df_limpo.at[idx, 'POSSIVEL_DUPLICATA'] = True
        alertas = str(df_limpo.at[idx, 'ALERTAS'])
        if alertas and alertas != '':
            df_limpo.at[idx, 'ALERTAS'] = alertas + ' | POSSIVEL_DUPLICATA'
        else:
            df_limpo.at[idx, 'ALERTAS'] = 'POSSIVEL_DUPLICATA'

    print(f"Marcadas {len(linhas_duplicadas)} linhas como possiveis duplicatas")

    # Marcar itens manuais
    linhas_manuais = {item['linha'] - 2 for item in itens_mao}
    for idx in linhas_manuais:
        df_limpo.at[idx, 'ITEM_MANUAL'] = True
        alertas = str(df_limpo.at[idx, 'ALERTAS'])
        if alertas and alertas != '':
            df_limpo.at[idx, 'ALERTAS'] = alertas + ' | ITEM_MANUAL'
        else:
            df_limpo.at[idx, 'ALERTAS'] = 'ITEM_MANUAL'

    print(f"Marcados {len(linhas_manuais)} itens como possivelmente escritos a mao")

    # Ordenar por data (mais recentes primeiro)
    df_limpo['DATA_SORT'] = pd.to_datetime(df_limpo['DATA_ORIGINAL'], format='%d/%m/%Y', errors='coerce')
    df_limpo = df_limpo.sort_values('DATA_SORT', ascending=False, na_position='last')
    df_limpo = df_limpo.drop('DATA_SORT', axis=1)

    print("Planilha ordenada por data")

    return df_limpo

def gerar_relatorios(df_original, df_limpo, duplicatas, itens_mao, stats):
    """Gera relatórios em Excel e texto"""
    print("\n" + "="*60)
    print("GERANDO RELATORIOS")
    print("="*60 + "\n")

    output_dir = Path('output')

    # Relatório de duplicatas
    if duplicatas:
        df_dup = pd.DataFrame(duplicatas)
        df_dup.to_excel(output_dir / 'relatorio_duplicatas.xlsx', index=False)
        print(f"[OK] Relatorio de duplicatas: output/relatorio_duplicatas.xlsx")

    # Relatório de itens manuais
    if itens_mao:
        df_mao = pd.DataFrame(itens_mao)
        df_mao.to_excel(output_dir / 'relatorio_itens_manuais.xlsx', index=False)
        print(f"[OK] Relatorio de itens manuais: output/relatorio_itens_manuais.xlsx")

    # Relatório de itens para revisão
    itens_revisao = df_limpo[df_limpo['POSSIVEL_DUPLICATA'] == True]
    if len(itens_revisao) > 0:
        itens_revisao.to_excel(output_dir / 'itens_para_revisao.xlsx', index=False)
        print(f"[OK] Itens para revisao: output/itens_para_revisao.xlsx ({len(itens_revisao)} itens)")

    # Relatório textual
    with open(output_dir / 'relatorio_limpeza.txt', 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("RELATORIO DE LIMPEZA DA PLANILHA\n")
        f.write("="*60 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Linhas originais: {stats['total_linhas']}\n")
        f.write(f"Linhas finais: {len(df_limpo)}\n")
        f.write(f"Duplicatas encontradas: {len(duplicatas)}\n")
        f.write(f"Itens manuais: {len(itens_mao)}\n")
        f.write(f"Linhas sem data: {stats['sem_data']}\n")
        f.write(f"Fornecedor generico: {stats['fornecedor_generico']}\n")
        f.write(f"Valor total: R$ {stats['valor_total']:,.2f}\n\n")

        if duplicatas:
            f.write("--- DUPLICATAS ---\n")
            for dup in duplicatas[:20]:
                f.write(f"Linhas {dup['linha_1']} e {dup['linha_2']}: {dup['fornecedor']} - R$ {dup['valor']:.2f}\n")
            if len(duplicatas) > 20:
                f.write(f"... e mais {len(duplicatas) - 20} duplicatas\n")
            f.write("\n")

        f.write("="*60 + "\n")

    print(f"[OK] Relatorio textual: output/relatorio_limpeza.txt")

def main():
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"

    print("="*60)
    print("LIMPEZA E ORGANIZACAO DA PLANILHA EXISTENTE")
    print("="*60)

    # Carregar planilha
    print(f"\nCarregando {planilha_path}...")
    df = pd.read_excel(planilha_path)

    # Analisar
    stats = analisar_planilha(df)

    # Detectar duplicatas
    duplicatas = detectar_duplicatas(df)

    # Identificar itens manuais
    itens_mao = identificar_itens_manuais(df)

    # Limpar e organizar
    df_limpo = limpar_e_organizar(df, duplicatas, itens_mao)

    # Salvar planilha limpa
    output_path = "Gastos_Consolidados_Flame_AUDITORIA_LIMPO.xlsx"
    print(f"\nSalvando planilha limpa em {output_path}...")
    df_limpo.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')
    print("[OK] Planilha atualizada salva!")

    # Gerar relatórios
    gerar_relatorios(df, df_limpo, duplicatas, itens_mao, stats)

    print("\n" + "="*60)
    print("LIMPEZA CONCLUIDA!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
