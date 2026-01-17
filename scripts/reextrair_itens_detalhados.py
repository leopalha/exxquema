"""
Script para identificar os 56 itens da revisao manual que precisam ser re-extraidos
com detalhamento item por item
"""

import pandas as pd
import json

def main():
    print("="*80)
    print("IDENTIFICAR ITENS PARA RE-EXTRACAO DETALHADA")
    print("="*80 + "\n")

    # Carregar planilha
    df = pd.read_excel("Gastos_Consolidados_Flame_AUDITORIA_FINAL_CLEAN.xlsx")

    # Itens da revisao manual
    revisao_manual = df[df['STATUS_VERIFICACAO'] == 'VERIFICADO_MANUALMENTE'].copy()

    print(f"Total de itens da revisao manual: {len(revisao_manual)}\n")

    # Ordenar por valor (maiores primeiro)
    revisao_manual_sorted = revisao_manual.sort_values('VLR_TOTAL', ascending=False)

    # Carregar JSONs de revisao para mapear pagina do PDF
    print("Carregando JSONs de revisao manual para mapear paginas do PDF...")

    lotes = [
        'output/revisao_paginas_01_20.json',
        'output/revisao_paginas_21_40.json',
        'output/revisao_paginas_41_60.json',
        'output/revisao_paginas_61_80.json',
        'output/revisao_paginas_81_98.json'
    ]

    # Criar mapa fornecedor+valor -> pagina
    nota_para_pagina = {}

    for lote_file in lotes:
        try:
            with open(lote_file, 'r', encoding='utf-8') as f:
                lote_data = json.load(f)
                for nota in lote_data.get('notas_processadas', []):
                    if nota.get('acao_necessaria') == 'ADICIONAR' or nota.get('status_planilha') == 'FALTANDO':
                        fornecedor = nota.get('fornecedor', '').upper().strip()
                        valor = nota.get('valor_total', 0)
                        pagina = nota.get('pagina', 0)

                        chave = f"{fornecedor}_{valor:.2f}"
                        nota_para_pagina[chave] = pagina
        except:
            pass

    print(f"[OK] {len(nota_para_pagina)} notas mapeadas para paginas do PDF\n")

    # Listar todos os itens que precisam ser re-extraidos
    print("="*80)
    print("ITENS PARA RE-EXTRACAO (ORDENADOS POR VALOR)")
    print("="*80 + "\n")

    print("Linha | Fornecedor | Valor | Pagina PDF | OBS")
    print("-"*80)

    lista_reextracao = []

    for idx, row in revisao_manual_sorted.iterrows():
        fornecedor = str(row['FORNECEDOR'])[:30]
        valor = row['VLR_TOTAL']
        obs = str(row.get('OBS_ORIGINAL', ''))

        # Tentar encontrar pagina do PDF
        chave = f"{fornecedor.upper().strip()}_{valor:.2f}"
        pagina_pdf = nota_para_pagina.get(chave, 0)

        # Extrair numero da pagina da observacao se disponivel
        if 'Pagina PDF' in obs or 'pagina' in obs.lower():
            import re
            match = re.search(r'[Pp]agina[s]?\s*(?:PDF)?\s*(\d+)', obs)
            if match:
                pagina_pdf = int(match.group(1))

        print(f"{idx+2:>5} | {fornecedor:30s} | R$ {valor:>9,.2f} | {pagina_pdf:>10} | {obs[:40]}")

        lista_reextracao.append({
            'linha_planilha': idx + 2,
            'fornecedor': fornecedor,
            'valor_total': valor,
            'pagina_pdf': pagina_pdf,
            'data': str(row.get('DATA_ORIGINAL', '')),
            'obs': obs
        })

    print("-"*80 + "\n")

    # Salvar lista de reextracao
    output_file = 'output/lista_reextracao_detalhada.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'total_itens': len(lista_reextracao),
            'valor_total': float(revisao_manual_sorted['VLR_TOTAL'].sum()),
            'itens': lista_reextracao
        }, f, indent=2, ensure_ascii=False)

    print(f"[OK] Lista salva: {output_file}\n")

    # Estatisticas
    print("="*80)
    print("RESUMO")
    print("="*80)
    print(f"""
Total de notas para re-extrair: {len(lista_reextracao)}
Valor total: R$ {revisao_manual_sorted['VLR_TOTAL'].sum():,.2f}

Distribuicao por faixa de valor:
  > R$ 1.000: {len(revisao_manual_sorted[revisao_manual_sorted['VLR_TOTAL'] > 1000])} notas
  R$ 500-1000: {len(revisao_manual_sorted[(revisao_manual_sorted['VLR_TOTAL'] >= 500) & (revisao_manual_sorted['VLR_TOTAL'] <= 1000)])} notas
  R$ 100-500: {len(revisao_manual_sorted[(revisao_manual_sorted['VLR_TOTAL'] >= 100) & (revisao_manual_sorted['VLR_TOTAL'] < 500)])} notas
  < R$ 100: {len(revisao_manual_sorted[revisao_manual_sorted['VLR_TOTAL'] < 100])} notas

PROXIMOS PASSOS:
1. Processar lote 1: Notas > R$ 1.000 (maior impacto)
2. Processar lote 2: Notas R$ 500-1000
3. Processar lote 3: Notas R$ 100-500
4. Processar lote 4: Notas < R$ 100

Para cada nota:
  - Ler imagem PNG da pagina do PDF (ou WhatsApp se disponivel)
  - Extrair TODOS os itens da nota fiscal
  - Para cada item: nome, quantidade, valor unitario, valor total
  - Gerar linhas detalhadas conforme padrao original

Estimativa final: {len(lista_reextracao)} linhas -> ~200-400 linhas (3-7x expansao)
""")

    print("="*80 + "\n")

if __name__ == "__main__":
    main()
