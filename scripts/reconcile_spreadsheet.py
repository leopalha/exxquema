"""
Script para reconciliar dados da planilha com os dados extraídos do PDF
Estratégia: Atualização incremental
"""

import json
import pandas as pd
from pathlib import Path
import re
from datetime import datetime
from detect_duplicates import criar_chave_duplicata, normalizar_fornecedor, normalizar_data, normalizar_valor

def enriquecer_linha_planilha(row, nota_pdf):
    """
    Enriquece uma linha da planilha com dados do PDF

    Args:
        row: Linha da planilha (Series)
        nota_pdf: Dados da nota do PDF (dict)

    Returns:
        dict com dados enriquecidos
    """
    dados_enriquecidos = row.to_dict()

    # Atualizar dados faltantes
    if pd.isna(row.get('DATA_ORIGINAL')) or row.get('DATA_ORIGINAL') == '' or row.get('DATA_ORIGINAL') == '-':
        if nota_pdf.get('data'):
            dados_enriquecidos['DATA_ORIGINAL'] = nota_pdf['data']
            dados_enriquecidos['ORIGEM_DADO'] = 'MESCLADO'

    if row.get('FORNECEDOR') in ['Fornecedor', '', None] or pd.isna(row.get('FORNECEDOR')):
        if nota_pdf.get('fornecedor'):
            dados_enriquecidos['FORNECEDOR'] = nota_pdf['fornecedor']
            dados_enriquecidos['ORIGEM_DADO'] = 'MESCLADO'

    # Adicionar dados novos do PDF
    if nota_pdf.get('cnpj'):
        dados_enriquecidos['CNPJ_FORNECEDOR'] = nota_pdf['cnpj']

    if nota_pdf.get('numero_nota'):
        dados_enriquecidos['NOTA_FISCAL_NUM'] = nota_pdf['numero_nota']

    if nota_pdf.get('pagina_pdf'):
        dados_enriquecidos['PAGINA_PDF'] = nota_pdf['pagina_pdf']

    # Atualizar status de verificação
    dados_enriquecidos['STATUS_VERIFICACAO'] = 'VERIFICADO_COM_PDF'

    # Se não tinha origem, marcar como planilha original
    if 'ORIGEM_DADO' not in dados_enriquecidos:
        dados_enriquecidos['ORIGEM_DADO'] = 'PLANILHA_ORIGINAL'

    return dados_enriquecidos

def criar_linha_nova_do_pdf(nota_pdf, categoria=None):
    """
    Cria uma nova linha na planilha baseada em dados do PDF

    Args:
        nota_pdf: Dados da nota do PDF (dict)
        categoria: Categoria inferida (opcional)

    Returns:
        dict com dados da nova linha
    """
    # Se a nota tem itens individuais, criar uma linha para cada item
    if nota_pdf.get('itens') and len(nota_pdf['itens']) > 0:
        linhas = []
        for item in nota_pdf['itens']:
            linha = {
                'CATEGORIA': item.get('categoria', categoria or 'Diversos'),
                'FORNECEDOR': nota_pdf.get('fornecedor', 'Fornecedor'),
                'CNPJ_FORNECEDOR': nota_pdf.get('cnpj', ''),
                'NOTA_FISCAL_NUM': nota_pdf.get('numero_nota', ''),
                'ITEM': item.get('descricao', ''),
                'QTD': item.get('quantidade', 1.0),
                'VLR_UNIT': item.get('valor_unitario', item.get('valor_total', 0.0)),
                'VLR_TOTAL': item.get('valor_total', 0.0),
                'DATA_ORIGINAL': nota_pdf.get('data', ''),
                'OBS_ORIGINAL': '',
                'DATA_ESTIMADA': None,
                'PERIODO_ESTIMADO': None,
                'RESPONSAVEL': 'RODRIGO',
                'STATUS_VERIFICACAO': 'NOVO_DO_PDF',
                'TIPO_ALERTA': '',
                'NIVEL_RISCO': 'BAIXO',
                'SUGESTOES': 'Item adicionado automaticamente do PDF',
                'POSSIVEL_DUPLICATA': False,
                'ORIGEM_DADO': 'PDF',
                'PAGINA_PDF': nota_pdf.get('pagina_pdf', '')
            }
            linhas.append(linha)
        return linhas

    # Se não tem itens, criar uma linha com o total da nota
    else:
        linha = {
            'CATEGORIA': nota_pdf.get('categoria_inferida', categoria or 'Diversos'),
            'FORNECEDOR': nota_pdf.get('fornecedor', 'Fornecedor'),
            'CNPJ_FORNECEDOR': nota_pdf.get('cnpj', ''),
            'NOTA_FISCAL_NUM': nota_pdf.get('numero_nota', ''),
            'ITEM': f"Compra {nota_pdf.get('fornecedor', 'não especificado')}",
            'QTD': 1.0,
            'VLR_UNIT': nota_pdf.get('valor_total', 0.0),
            'VLR_TOTAL': nota_pdf.get('valor_total', 0.0),
            'DATA_ORIGINAL': nota_pdf.get('data', ''),
            'OBS_ORIGINAL': '',
            'DATA_ESTIMADA': None,
            'PERIODO_ESTIMADO': None,
            'RESPONSAVEL': 'RODRIGO',
            'STATUS_VERIFICACAO': 'NOVO_DO_PDF',
            'TIPO_ALERTA': '',
            'NIVEL_RISCO': 'BAIXO',
            'SUGESTOES': 'Item adicionado automaticamente do PDF',
            'POSSIVEL_DUPLICATA': False,
            'ORIGEM_DADO': 'PDF',
            'PAGINA_PDF': nota_pdf.get('pagina_pdf', '')
        }
        return [linha]

def processar_reconciliacao(planilha_path, notas_json_path, relatorio_dup_path, output_path):
    """
    Processa reconciliação entre planilha e PDF

    Args:
        planilha_path: Caminho da planilha Excel
        notas_json_path: Caminho do JSON de notas categorizadas
        relatorio_dup_path: Caminho do relatório de duplicatas
        output_path: Caminho da planilha de saída
    """
    print("=== RECONCILIAÇÃO DE DADOS ===\n")

    # Carregar planilha
    print(f"Carregando planilha {planilha_path}...")
    df = pd.read_excel(planilha_path)
    print(f"Total de linhas na planilha original: {len(df)}\n")

    # Carregar notas do PDF
    print(f"Carregando notas do PDF {notas_json_path}...")
    with open(notas_json_path, 'r', encoding='utf-8') as f:
        notas_pdf = json.load(f)
    print(f"Total de notas no PDF: {len(notas_pdf)}\n")

    # Carregar relatório de duplicatas
    print(f"Carregando relatório de duplicatas {relatorio_dup_path}...")
    with open(relatorio_dup_path, 'r', encoding='utf-8') as f:
        relatorio_dup = json.load(f)

    # Criar mapa de chaves da planilha
    print("Criando mapa de chaves da planilha...")
    chaves_planilha = {}
    for idx, row in df.iterrows():
        chave = criar_chave_duplicata(
            row.get('FORNECEDOR'),
            row.get('DATA_ORIGINAL'),
            row.get('VLR_TOTAL')
        )
        if chave:
            chaves_planilha[chave] = idx

    # Criar mapa de chaves do PDF
    print("Criando mapa de chaves do PDF...")
    chaves_pdf = {}
    for nota in notas_pdf:
        chave = criar_chave_duplicata(
            nota.get('fornecedor'),
            nota.get('data'),
            nota.get('valor_total')
        )
        if chave:
            if chave not in chaves_pdf:
                chaves_pdf[chave] = []
            chaves_pdf[chave].append(nota)

    # Processar planilha
    print("\nProcessando linhas da planilha...")
    linhas_atualizadas = []
    itens_mao = {item['linha'] for item in relatorio_dup['itens_mao']}

    stats = {
        'linhas_mantidas': 0,
        'linhas_enriquecidas': 0,
        'linhas_marcadas_duplicata': 0,
        'linhas_sem_nota': 0
    }

    for idx, row in df.iterrows():
        linha_num = idx + 2
        chave = criar_chave_duplicata(
            row.get('FORNECEDOR'),
            row.get('DATA_ORIGINAL'),
            row.get('VLR_TOTAL')
        )

        linha_atualizada = row.to_dict()

        # Adicionar novas colunas se não existirem
        if 'CNPJ_FORNECEDOR' not in linha_atualizada:
            linha_atualizada['CNPJ_FORNECEDOR'] = ''
        if 'NOTA_FISCAL_NUM' not in linha_atualizada:
            linha_atualizada['NOTA_FISCAL_NUM'] = ''
        if 'POSSIVEL_DUPLICATA' not in linha_atualizada:
            linha_atualizada['POSSIVEL_DUPLICATA'] = False
        if 'ORIGEM_DADO' not in linha_atualizada:
            linha_atualizada['ORIGEM_DADO'] = 'PLANILHA_ORIGINAL'
        if 'PAGINA_PDF' not in linha_atualizada:
            linha_atualizada['PAGINA_PDF'] = ''

        # Marcar itens escritos à mão como possíveis duplicatas
        if linha_num in itens_mao:
            linha_atualizada['POSSIVEL_DUPLICATA'] = True
            linha_atualizada['SUGESTOES'] = str(linha_atualizada.get('SUGESTOES', '')) + ' | Item possivelmente escrito à mão - verificar duplicidade'
            stats['linhas_marcadas_duplicata'] += 1

        # Se tem chave e existe no PDF, enriquecer dados
        if chave and chave in chaves_pdf:
            # Pegar primeira ocorrência do PDF
            nota_pdf = chaves_pdf[chave][0]
            linha_atualizada = enriquecer_linha_planilha(pd.Series(linha_atualizada), nota_pdf)
            stats['linhas_enriquecidas'] += 1

        # Se não tem correspondente no PDF
        elif chave and chave not in chaves_pdf:
            linha_atualizada['TIPO_ALERTA'] = str(linha_atualizada.get('TIPO_ALERTA', '')) + ' | ALERTA_SEM_NOTA_FISCAL'
            linha_atualizada['SUGESTOES'] = str(linha_atualizada.get('SUGESTOES', '')) + ' | Verificar se nota fiscal está no PDF'
            stats['linhas_sem_nota'] += 1
        else:
            stats['linhas_mantidas'] += 1

        linhas_atualizadas.append(linha_atualizada)

    # Adicionar itens do PDF que não estão na planilha
    print("\nAdicionando itens do PDF que faltam na planilha...")
    itens_adicionados = 0

    for chave, notas in chaves_pdf.items():
        if chave not in chaves_planilha:
            # Adicionar todas as ocorrências (pode haver múltiplas páginas)
            for nota in notas:
                novas_linhas = criar_linha_nova_do_pdf(nota)
                linhas_atualizadas.extend(novas_linhas)
                itens_adicionados += len(novas_linhas)

    print(f"Total de itens adicionados do PDF: {itens_adicionados}")

    # Criar DataFrame final
    print("\nCriando DataFrame final...")
    df_final = pd.DataFrame(linhas_atualizadas)

    # Ordenar por data (mais recentes primeiro)
    df_final['DATA_SORT'] = pd.to_datetime(df_final['DATA_ORIGINAL'], format='%d/%m/%Y', errors='coerce')
    df_final = df_final.sort_values('DATA_SORT', ascending=False, na_position='last')
    df_final = df_final.drop('DATA_SORT', axis=1)

    # Salvar planilha atualizada
    print(f"\nSalvando planilha atualizada em {output_path}...")
    df_final.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')

    # Exibir estatísticas
    print("\n=== ESTATÍSTICAS DE RECONCILIAÇÃO ===")
    print(f"Linhas originais da planilha: {len(df)}")
    print(f"  - Mantidas sem alteração: {stats['linhas_mantidas']}")
    print(f"  - Enriquecidas com dados do PDF: {stats['linhas_enriquecidas']}")
    print(f"  - Marcadas como possível duplicata: {stats['linhas_marcadas_duplicata']}")
    print(f"  - Sem nota fiscal no PDF: {stats['linhas_sem_nota']}")
    print(f"\nItens adicionados do PDF: {itens_adicionados}")
    print(f"\nTotal de linhas na planilha final: {len(df_final)}")
    print(f"Diferença: +{len(df_final) - len(df)} linhas")

    return df_final, stats

def main():
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"
    notas_json_path = Path('output/notas_categorizadas.json')
    relatorio_dup_path = Path('output/relatorio_duplicatas.json')
    output_path = "Gastos_Consolidados_Flame_AUDITORIA.xlsx"

    if not Path(planilha_path).exists():
        print(f"ERRO: Planilha {planilha_path} não encontrada!")
        return

    if not notas_json_path.exists():
        print(f"ERRO: Arquivo {notas_json_path} não encontrado!")
        print("Execute primeiro os scripts anteriores")
        return

    if not relatorio_dup_path.exists():
        print(f"ERRO: Arquivo {relatorio_dup_path} não encontrado!")
        print("Execute primeiro o script detect_duplicates.py")
        return

    processar_reconciliacao(planilha_path, notas_json_path, relatorio_dup_path, output_path)
    print("\nReconciliação concluída!")

if __name__ == "__main__":
    main()
