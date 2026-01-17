"""
Script para comparar reviso manual com planilha atual
Identifica:
1. Notas que esto no PDF mas NO na planilha (para adicionar)
2. Valores incorretos na planilha
3. Duplicatas confirmadas
4. Notas ilegveis que precisam ateno
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime

def normalizar_fornecedor(fornecedor):
    """Normaliza nome de fornecedor para comparao"""
    if not fornecedor or pd.isna(fornecedor):
        return ""
    fornecedor = str(fornecedor).upper().strip()
    # Remover pontuao e espaos extras
    import re
    fornecedor = re.sub(r'[^A-Z0-9\s]', '', fornecedor)
    return ' '.join(fornecedor.split())

def verificar_nota_existe(df, fornecedor, valor, data=None, tolerancia=0.05):
    """
    Verifica se uma nota j existe na planilha
    Retorna: (existe, linhas_encontradas, mensagem)
    """
    if not fornecedor or not valor:
        return False, [], "Dados insuficientes para busca"

    fornecedor_norm = normalizar_fornecedor(fornecedor)

    # Buscar por fornecedor similar
    df['FORNECEDOR_NORM'] = df['FORNECEDOR'].apply(normalizar_fornecedor)

    candidatos = df[df['FORNECEDOR_NORM'].str.contains(fornecedor_norm[:10], case=False, na=False)]

    if len(candidatos) == 0:
        return False, [], f"Fornecedor '{fornecedor}' no encontrado"

    # Buscar por valor (com tolerncia de 5%)
    valor_min = valor * (1 - tolerancia)
    valor_max = valor * (1 + tolerancia)

    candidatos_valor = candidatos[
        (candidatos['VLR_TOTAL'] >= valor_min) &
        (candidatos['VLR_TOTAL'] <= valor_max)
    ]

    if len(candidatos_valor) == 0:
        return False, [], f"Valor R$ {valor:.2f} no encontrado para '{fornecedor}'"

    # Se tem data, verificar tambm
    if data:
        candidatos_data = candidatos_valor[candidatos_valor['DATA_ORIGINAL'] == data]
        if len(candidatos_data) > 0:
            return True, candidatos_data.index.tolist(), "Encontrado (fornecedor + valor + data)"

    return True, candidatos_valor.index.tolist(), "Encontrado (fornecedor + valor)"

def carregar_jsons_revisao():
    """Carrega todos os arquivos JSON de reviso"""
    output_dir = Path("output")
    notas_todas = []

    for i in range(1, 6):
        if i == 1:
            arquivo = output_dir / "revisao_paginas_01_20.json"
        elif i == 2:
            arquivo = output_dir / "revisao_paginas_21_40.json"
        elif i == 3:
            arquivo = output_dir / "revisao_paginas_41_60.json"
        elif i == 4:
            arquivo = output_dir / "revisao_paginas_61_80.json"
        else:
            arquivo = output_dir / "revisao_paginas_81_98.json"

        if arquivo.exists():
            with open(arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)
                notas_todas.extend(dados['notas_processadas'])

    return notas_todas

def main():
    print("="*80)
    print("COMPARACAO: REVISAO MANUAL vs PLANILHA ATUAL")
    print("="*80 + "\n")

    # Carregar planilha
    print("Carregando planilha atual...")
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA_CORRIGIDO.xlsx"
    df = pd.read_excel(planilha_path)
    print(f"[OK] Planilha carregada: {len(df)} linhas, Total: R$ {df['VLR_TOTAL'].sum():,.2f}\n")

    # Carregar JSONs de reviso
    print("Carregando dados da reviso manual...")
    notas_revisao = carregar_jsons_revisao()
    print(f"[OK] {len(notas_revisao)} paginas revisadas\n")

    # Separar notas por status
    notas_legiveis = [n for n in notas_revisao if n.get('valor_total')]
    notas_ilegiveis = [n for n in notas_revisao if not n.get('valor_total')]

    print(f" Notas legveis: {len(notas_legiveis)}")
    print(f" Notas ilegveis: {len(notas_ilegiveis)}\n")

    # Anlise das notas legveis
    print("="*80)
    print("ANLISE: NOTAS LEGVEIS")
    print("="*80 + "\n")

    notas_encontradas = []
    notas_nao_encontradas = []
    notas_duplicatas_suspeitas = []

    for nota in notas_legiveis:
        fornecedor = nota.get('fornecedor')
        valor = nota.get('valor_total')
        data = nota.get('data')
        pagina = nota.get('pagina')

        existe, linhas, msg = verificar_nota_existe(df, fornecedor, valor, data)

        if existe:
            if len(linhas) > 1:
                notas_duplicatas_suspeitas.append({
                    'pagina': pagina,
                    'fornecedor': fornecedor,
                    'valor': valor,
                    'data': data,
                    'linhas_planilha': linhas,
                    'msg': f"ATENO: {len(linhas)} ocorrncias encontradas!"
                })
            else:
                notas_encontradas.append({
                    'pagina': pagina,
                    'fornecedor': fornecedor,
                    'valor': valor,
                    'data': data,
                    'linha_planilha': linhas[0] if linhas else None
                })
        else:
            notas_nao_encontradas.append({
                'pagina': pagina,
                'fornecedor': fornecedor,
                'valor': valor,
                'data': data,
                'msg': msg
            })

    # Relatrios
    print(f" Notas J na planilha: {len(notas_encontradas)}")
    print(f" Notas FALTANDO na planilha: {len(notas_nao_encontradas)}")
    print(f"  Possveis duplicatas: {len(notas_duplicatas_suspeitas)}\n")

    # Salvar relatrio de notas faltando
    if notas_nao_encontradas:
        print("\n" + "="*80)
        print("NOTAS FALTANDO NA PLANILHA (ADICIONAR)")
        print("="*80 + "\n")

        valor_total_faltando = sum(n['valor'] for n in notas_nao_encontradas)
        print(f"Total de notas: {len(notas_nao_encontradas)}")
        print(f"Valor total: R$ {valor_total_faltando:,.2f}\n")

        with open('output/notas_para_adicionar.txt', 'w', encoding='utf-8') as f:
            f.write("NOTAS PARA ADICIONAR NA PLANILHA\n")
            f.write("="*80 + "\n\n")
            f.write(f"Total: {len(notas_nao_encontradas)} notas\n")
            f.write(f"Valor total: R$ {valor_total_faltando:,.2f}\n\n")

            for i, nota in enumerate(notas_nao_encontradas, 1):
                linha = (
                    f"{i}. Pgina {nota['pagina']}\n"
                    f"   Fornecedor: {nota['fornecedor']}\n"
                    f"   Valor: R$ {nota['valor']:,.2f}\n"
                    f"   Data: {nota['data'] or 'No informada'}\n"
                    f"   Motivo: {nota['msg']}\n\n"
                )
                print(linha)
                f.write(linha)

        print(f" Relatrio salvo: output/notas_para_adicionar.txt")

    # Salvar relatrio de duplicatas
    if notas_duplicatas_suspeitas:
        print("\n" + "="*80)
        print("POSSVEIS DUPLICATAS (VERIFICAR)")
        print("="*80 + "\n")

        with open('output/duplicatas_suspeitas.txt', 'w', encoding='utf-8') as f:
            f.write("POSSVEIS DUPLICATAS PARA VERIFICAR\n")
            f.write("="*80 + "\n\n")
            f.write(f"Total: {len(notas_duplicatas_suspeitas)} casos\n\n")

            for i, nota in enumerate(notas_duplicatas_suspeitas, 1):
                linha = (
                    f"{i}. Pgina {nota['pagina']}\n"
                    f"   Fornecedor: {nota['fornecedor']}\n"
                    f"   Valor: R$ {nota['valor']:,.2f}\n"
                    f"   Data: {nota['data'] or 'No informada'}\n"
                    f"   {nota['msg']}\n"
                    f"   Linhas na planilha: {nota['linhas_planilha']}\n\n"
                )
                print(linha)
                f.write(linha)

        print(f" Relatrio salvo: output/duplicatas_suspeitas.txt")

    # Relatrio de notas ilegveis
    print("\n" + "="*80)
    print("NOTAS ILEGVEIS (PRECISAM ATENO MANUAL)")
    print("="*80 + "\n")
    print(f"Total: {len(notas_ilegiveis)} notas\n")

    with open('output/notas_ilegiveis.txt', 'w', encoding='utf-8') as f:
        f.write("NOTAS ILEGVEIS - PRECISAM VERIFICAO MANUAL\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total: {len(notas_ilegiveis)} pginas\n\n")

        for i, nota in enumerate(notas_ilegiveis, 1):
            linha = (
                f"{i}. Pgina {nota['pagina']}\n"
                f"   Fornecedor: {nota.get('fornecedor', 'No identificado')}\n"
                f"   Observao: {nota.get('observacoes', 'N/A')}\n\n"
            )
            if i <= 10:  # Mostrar s as primeiras 10
                print(linha)
            f.write(linha)

    print(f" Relatrio salvo: output/notas_ilegiveis.txt")
    print(f"   (Lista completa das {len(notas_ilegiveis)} pginas ilegveis)")

    # Resumo final
    print("\n" + "="*80)
    print("RESUMO FINAL")
    print("="*80)
    print(f"")
    print(f"Planilha atual:")
    print(f"   Linhas: {len(df)}")
    print(f"   Valor total: R$ {df['VLR_TOTAL'].sum():,.2f}")
    print(f"")
    print(f"Reviso manual (98 pginas):")
    print(f"   Notas legveis: {len(notas_legiveis)}")
    print(f"   Notas j na planilha: {len(notas_encontradas)}")
    print(f"   Notas para ADICIONAR: {len(notas_nao_encontradas)}")
    if notas_nao_encontradas:
        valor_adicionar = sum(n['valor'] for n in notas_nao_encontradas)
        print(f"     Valor a adicionar: R$ {valor_adicionar:,.2f}")
    print(f"   Possveis duplicatas: {len(notas_duplicatas_suspeitas)}")
    print(f"   Notas ilegveis: {len(notas_ilegiveis)}")
    print(f"")
    print("="*80)

    print(f"\n Anlise concluda em {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

if __name__ == "__main__":
    main()
