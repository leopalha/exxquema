"""
Script para aplicar itens detalhados extraidos manualmente
Substituir linhas resumidas por linhas detalhadas item a item
"""

import pandas as pd
import json
from datetime import datetime

def main():
    print("="*80)
    print("APLICAR ITENS DETALHADOS NA PLANILHA")
    print("="*80 + "\n")

    # Carregar planilha atual
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_CLEAN.xlsx")

    linhas_inicial = len(df)
    valor_inicial = df['VLR_TOTAL'].sum()

    print(f"Planilha carregada: {linhas_inicial} linhas | R$ {valor_inicial:,.2f}\n")

    # Carregar JSON com itens detalhados
    with open('output/itens_detalhados_lote1_acima_1000.json', 'r', encoding='utf-8') as f:
        lote_data = json.load(f)

    print(f"Carregado lote com {len(lote_data['notas_extraidas'])} notas detalhadas\n")

    # Identificar linhas a remover e adicionar
    linhas_remover = []
    linhas_adicionar = []

    print("="*80)
    print("PROCESSANDO NOTAS DETALHADAS")
    print("="*80 + "\n")

    for nota in lote_data['notas_extraidas']:
        fornecedor = nota['fornecedor']
        valor_total = nota['valor_total_nota']
        pagina = nota['pagina_pdf']

        print(f"\nProcessando: {fornecedor} | R$ {valor_total:,.2f} | Pagina {pagina}")

        # Buscar linha resumida correspondente na planilha
        linha_resumida = df[
            (df['FORNECEDOR'].str.upper().str.contains(fornecedor.upper(), na=False)) &
            (abs(df['VLR_TOTAL'] - valor_total) < 5) &
            (df['STATUS_VERIFICACAO'] == 'VERIFICADO_MANUALMENTE')
        ]

        if len(linha_resumida) == 0:
            print(f"  [!] Linha resumida NAO encontrada - pulando")
            continue

        if len(linha_resumida) > 1:
            print(f"  [!] Multiplas linhas encontradas ({len(linha_resumida)}) - usando primeira")

        # Pegar primeira correspondencia
        idx_resumida = linha_resumida.index[0]
        row_resumida = linha_resumida.iloc[0]

        print(f"  [OK] Linha resumida encontrada: indice {idx_resumida} (linha Excel {idx_resumida+2})")
        print(f"       Atual: {row_resumida['ITEM'][:50]}")

        # Marcar para remocao
        linhas_remover.append(idx_resumida)

        # Criar linhas detalhadas
        categoria = row_resumida['CATEGORIA']
        data = row_resumida['DATA_ORIGINAL']

        print(f"  [+] Adicionando {len(nota['itens'])} itens detalhados:")

        for item_data in nota['itens']:
            nova_linha = {
                'CATEGORIA': categoria,
                'FORNECEDOR': fornecedor,
                'ITEM': item_data['item'],
                'QTD': item_data['qtd'],
                'VLR_UNIT': item_data['vlr_unit'],
                'VLR_TOTAL': item_data['vlr_total'],
                'DATA_ORIGINAL': data,
                'OBS_ORIGINAL': f"Item detalhado - Pagina PDF {pagina}. {nota.get('observacao', '')}",
                'STATUS_VERIFICACAO': 'DETALHADO_MANUALMENTE'
            }

            linhas_adicionar.append(nova_linha)
            print(f"       - {item_data['item'][:45]:45s} | Qtd: {item_data['qtd']:>6} | R$ {item_data['vlr_total']:>8,.2f}")

        print(f"  [OK] {len(nota['itens'])} itens adicionados")

    # Aplicar mudancas
    print("\n" + "="*80)
    print("APLICANDO MUDANCAS")
    print("="*80 + "\n")

    print(f"Linhas a remover: {len(linhas_remover)}")
    print(f"Linhas a adicionar: {len(linhas_adicionar)}\n")

    # Remover linhas resumidas
    df_novo = df.drop(linhas_remover).reset_index(drop=True)

    # Adicionar linhas detalhadas
    df_detalhado = pd.DataFrame(linhas_adicionar)
    df_final = pd.concat([df_novo, df_detalhado], ignore_index=True)

    # Ordenar por data
    df_final['DATA_SORT'] = pd.to_datetime(df_final['DATA_ORIGINAL'], format='%d/%m/%Y', errors='coerce')
    df_final = df_final.sort_values('DATA_SORT').drop(columns=['DATA_SORT']).reset_index(drop=True)

    linhas_final = len(df_final)
    valor_final = df_final['VLR_TOTAL'].sum()

    # Resultado
    print("="*80)
    print("RESULTADO")
    print("="*80)
    print(f"\nANTES:")
    print(f"   Linhas: {linhas_inicial}")
    print(f"   Valor: R$ {valor_inicial:,.2f}")
    print(f"\nMUDANCAS:")
    print(f"   Removidas (resumidas): {len(linhas_remover)}")
    print(f"   Adicionadas (detalhadas): {len(linhas_adicionar)}")
    print(f"\nDEPOIS:")
    print(f"   Linhas: {linhas_final}")
    print(f"   Valor: R$ {valor_final:,.2f}")
    print(f"\nDIFERENCA:")
    print(f"   Linhas: +{linhas_final - linhas_inicial}")
    print(f"   Valor: R$ {valor_final - valor_inicial:,.2f}")
    print("="*80 + "\n")

    # Salvar
    output_file = "Gastos_Consolidados_Flame_AUDITORIA_DETALHADO_LOTE1.xlsx"
    print(f"Salvando planilha detalhada em {output_file}...")
    df_final.to_excel(output_file, index=False, sheet_name='Auditoria Gastos')
    print(f"[OK] Planilha salva!\n")

    # Relatorio
    with open('output/relatorio_aplicacao_detalhes_lote1.txt', 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RELATORIO - APLICACAO DE ITENS DETALHADOS (LOTE 1)\n")
        f.write("="*80 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Linhas antes: {linhas_inicial}\n")
        f.write(f"Linhas removidas (resumidas): {len(linhas_remover)}\n")
        f.write(f"Linhas adicionadas (detalhadas): {len(linhas_adicionar)}\n")
        f.write(f"Linhas depois: {linhas_final}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor antes: R$ {valor_inicial:,.2f}\n")
        f.write(f"Valor depois: R$ {valor_final:,.2f}\n")
        f.write(f"Diferenca: R$ {valor_final - valor_inicial:,.2f}\n\n")

        f.write("--- DETALHES ---\n")
        f.write(f"Notas processadas: {len(lote_data['notas_extraidas'])}\n")
        f.write(f"Total itens detalhados extraidos: {len(linhas_adicionar)}\n\n")

        f.write("--- NOTAS DETALHADAS ---\n")
        for nota in lote_data['notas_extraidas']:
            f.write(f"\nPagina {nota['pagina_pdf']}: {nota['fornecedor']} - R$ {nota['valor_total_nota']:,.2f}\n")
            f.write(f"  Itens extraidos: {len(nota['itens'])}\n")
            f.write(f"  Observacao: {nota.get('observacao', 'N/A')}\n")

        f.write("\n" + "="*80 + "\n")

    print(f"[OK] Relatorio salvo: output/relatorio_aplicacao_detalhes_lote1.txt\n")

    print("="*80)
    print("PROCESSO CONCLUIDO - LOTE 1!")
    print("="*80)
    print(f"\nArquivo gerado: {output_file}")
    print(f"Linhas: {linhas_inicial} -> {linhas_final} (+{linhas_final - linhas_inicial})")
    print(f"Valor: R$ {valor_final:,.2f}\n")

    print("PROXIMOS PASSOS:")
    print("  1. Validar planilha gerada")
    print("  2. Processar lote 2 (notas R$ 500-1000)")
    print("  3. Processar lote 3 (notas R$ 100-500)")
    print("  4. Processar lote 4 (notas < R$ 100)")
    print("  5. Consolidar tudo em planilha final\n")

if __name__ == "__main__":
    main()
