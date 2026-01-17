"""
Script para verificar todas as notas de CityLar e MT Solitech
"""

import json
from pathlib import Path

def main():
    print("="*80)
    print("VERIFICACAO: CITYLAR E MT SOLITECH")
    print("="*80 + "\n")

    lotes = [
        'output/revisao_paginas_01_20.json',
        'output/revisao_paginas_21_40.json',
        'output/revisao_paginas_41_60.json',
        'output/revisao_paginas_61_80.json',
        'output/revisao_paginas_81_98.json'
    ]

    citylar = []
    solitech = []

    for lote_path in lotes:
        with open(lote_path, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            for nota in dados['notas_processadas']:
                fornecedor = nota.get('fornecedor', '').upper()

                if 'CITYLAR' in fornecedor:
                    citylar.append({
                        'pagina': nota['pagina'],
                        'valor': nota.get('valor_total'),
                        'data': nota.get('data'),
                        'observacoes': nota.get('observacoes')
                    })

                if 'SOLITECH' in fornecedor:
                    solitech.append({
                        'pagina': nota['pagina'],
                        'valor': nota.get('valor_total'),
                        'numero': nota.get('numero_nota'),
                        'observacoes': nota.get('observacoes')
                    })

    # CITYLAR
    print("CITYLAR - TODAS AS NOTAS ENCONTRADAS")
    print("="*80)
    print(f"Total de notas: {len(citylar)}\n")

    for i, c in enumerate(citylar, 1):
        valor_str = f"R$ {c['valor']:,.2f}" if c['valor'] else "ILEGIVEL"
        data_str = c['data'] if c['data'] else "-"
        print(f"{i}. Pagina {c['pagina']:3d}: {valor_str:>15s} | Data: {data_str:12s}")
        if c['observacoes']:
            obs = c['observacoes'][:60]
            print(f"   Obs: {obs}")

    valor_total_citylar = sum(c['valor'] for c in citylar if c['valor'])
    ilegiveis_citylar = len([c for c in citylar if not c['valor']])

    print(f"\nRESUMO CITYLAR:")
    print(f"  Notas com valor legivel: {len(citylar) - ilegiveis_citylar}")
    print(f"  Notas ilegiveis: {ilegiveis_citylar}")
    print(f"  Valor total identificado: R$ {valor_total_citylar:,.2f}")

    # MT SOLITECH
    print("\n" + "="*80)
    print("MT SOLITECH - TODAS AS NOTAS ENCONTRADAS")
    print("="*80)
    print(f"Total de notas: {len(solitech)}\n")

    for i, s in enumerate(solitech, 1):
        valor_str = f"R$ {s['valor']:,.2f}" if s['valor'] else "ILEGIVEL"
        num_str = s['numero'] if s['numero'] else "-"
        print(f"{i}. Pagina {s['pagina']:3d}: {valor_str:>15s} | Proposta: {num_str}")
        if s['observacoes']:
            obs = s['observacoes'][:70]
            print(f"   Obs: {obs}")

    valor_total_solitech = sum(s['valor'] for s in solitech if s['valor'])
    ilegiveis_solitech = len([s for s in solitech if not s['valor']])

    print(f"\nRESUMO MT SOLITECH:")
    print(f"  Notas com valor legivel: {len(solitech) - ilegiveis_solitech}")
    print(f"  Notas ilegiveis: {ilegiveis_solitech}")
    print(f"  Valor total identificado: R$ {valor_total_solitech:,.2f}")

    print("\n" + "="*80)
    print("RESUMO GERAL")
    print("="*80)
    print(f"CityLar: {len(citylar)} notas | R$ {valor_total_citylar:,.2f}")
    print(f"MT Solitech: {len(solitech)} notas | R$ {valor_total_solitech:,.2f}")
    print(f"Total: R$ {valor_total_citylar + valor_total_solitech:,.2f}")
    print("="*80)

if __name__ == "__main__":
    main()
