"""
Script para adicionar as notas faltantes identificadas na revisao manual
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime

def carregar_jsons_revisao():
    """Carrega todos os arquivos JSON de revisao"""
    output_dir = Path("output")
    notas_todas = []

    arquivos = [
        "revisao_paginas_01_20.json",
        "revisao_paginas_21_40.json",
        "revisao_paginas_41_60.json",
        "revisao_paginas_61_80.json",
        "revisao_paginas_81_98.json"
    ]

    for arquivo in arquivos:
        caminho = output_dir / arquivo
        if caminho.exists():
            with open(caminho, 'r', encoding='utf-8') as f:
                dados = json.load(f)
                notas_todas.extend(dados['notas_processadas'])

    return notas_todas

def categorizar_item(fornecedor, itens):
    """
    Tenta categorizar o item baseado no fornecedor e itens
    """
    fornecedor_upper = str(fornecedor).upper()
    itens_str = ' '.join(itens).upper() if itens else ''

    # Materiais de construcao
    if any(x in fornecedor_upper for x in ['BNB', 'OBRAMAX', 'CONSTRUCAO', 'BEFRAN', 'TUBO JUNIOR', 'MARCELO']):
        return 'Material de Construcao'

    # Materiais eletricos
    if any(x in fornecedor_upper for x in ['LINX', 'ELETRIC', 'LAS ELETRICA']):
        return 'Material Eletrico'

    # Bazar/Limpeza
    if 'BAZAR' in fornecedor_upper or 'TODAOBRA' in fornecedor_upper:
        return 'Bazar/Limpeza'

    # Supermercado/Alimentacao
    if any(x in fornecedor_upper for x in ['ZONA SUL', 'MUNDIAL', 'GRAN FRUTI', 'SERNORGS']):
        return 'Alimentacao'

    # Servicos/TI
    if any(x in fornecedor_upper for x in ['MT SOLITECH', 'CITYLAR']):
        return 'Servicos/Equipamentos'

    # Restaurante
    if 'RESTAURANTE' in fornecedor_upper or 'PIX' in fornecedor_upper:
        return 'Alimentacao'

    # Bebidas
    if 'BEBIDAS' in fornecedor_upper or 'LINK BR' in fornecedor_upper:
        return 'Bebidas/Insumos'

    # Default
    return 'A CATEGORIZAR'

def main():
    print("="*80)
    print("ADICIONAR NOTAS FALTANTES NA PLANILHA")
    print("="*80 + "\n")

    # Carregar planilha
    print("Carregando planilha atual...")
    planilha_path = "Gastos_Consolidados_Flame_AUDITORIA_CORRIGIDO.xlsx"
    df = pd.read_excel(planilha_path)

    linhas_original = len(df)
    valor_original = df['VLR_TOTAL'].sum()

    print(f"[OK] Planilha carregada")
    print(f"     Linhas: {linhas_original}")
    print(f"     Valor total: R$ {valor_original:,.2f}\n")

    # Carregar notas da revisao
    print("Carregando notas da revisao manual...")
    notas_revisao = carregar_jsons_revisao()
    notas_legiveis = [n for n in notas_revisao if n.get('valor_total')]
    print(f"[OK] {len(notas_legiveis)} notas legiveis identificadas\n")

    # Preparar novas linhas para adicionar
    print("Preparando novas linhas para adicionar...\n")

    novas_linhas = []

    for nota in notas_legiveis:
        fornecedor = nota.get('fornecedor')
        valor = nota.get('valor_total')
        data = nota.get('data')
        pagina = nota.get('pagina')
        itens = nota.get('itens_principais', [])
        cnpj = nota.get('cnpj')

        if not fornecedor or not valor:
            continue

        # Criar item descritivo
        if itens and len(itens) > 0:
            item_desc = ', '.join(itens[:3])  # Primeiros 3 itens
            if len(itens) > 3:
                item_desc += f" e mais {len(itens)-3} itens"
        else:
            item_desc = f"Compra conforme NF (pagina {pagina})"

        # Categorizar
        categoria = categorizar_item(fornecedor, itens)

        # Criar nova linha
        nova_linha = {
            'CATEGORIA': categoria,
            'FORNECEDOR': fornecedor,
            'ITEM': item_desc,
            'QTD': 1,
            'VLR_UNIT': valor,
            'VLR_TOTAL': valor,
            'DATA_ORIGINAL': data if data else '-',
            'OBS_ORIGINAL': f'Adicionado via revisao manual - Pagina PDF {pagina}',
            'DATA_ESTIMADA': '',
            'PERIODO_ESTIMADO': '',
            'RESPONSAVEL': 'Auditoria Manual',
            'STATUS_VERIFICACAO': 'VERIFICADO_MANUALMENTE',
            'TIPO_ALERTA': '',
            'NIVEL_RISCO': 'BAIXO',
            'SUGESTOES': 'Item verificado manualmente via revisao do PDF'
        }

        novas_linhas.append(nova_linha)
        print(f"[+] Pagina {pagina:3d}: {fornecedor[:40]:40s} R$ {valor:>10,.2f}")

    if not novas_linhas:
        print("\n[!] Nenhuma nota nova para adicionar!")
        return

    # Adicionar novas linhas
    print(f"\n\nAdicionando {len(novas_linhas)} novas linhas na planilha...")
    df_novas = pd.DataFrame(novas_linhas)
    df_final = pd.concat([df, df_novas], ignore_index=True)

    linhas_final = len(df_final)
    valor_final = df_final['VLR_TOTAL'].sum()

    print(f"[OK] Novas linhas adicionadas\n")

    # Estatisticas
    print("="*80)
    print("ESTATISTICAS")
    print("="*80)
    print(f"")
    print(f"ANTES:")
    print(f"   Linhas: {linhas_original}")
    print(f"   Valor total: R$ {valor_original:,.2f}")
    print(f"")
    print(f"ADICIONADO:")
    print(f"   Linhas: {len(novas_linhas)}")
    print(f"   Valor total: R$ {sum(l['VLR_TOTAL'] for l in novas_linhas):,.2f}")
    print(f"")
    print(f"DEPOIS:")
    print(f"   Linhas: {linhas_final}")
    print(f"   Valor total: R$ {valor_final:,.2f}")
    print(f"")
    print(f"DIFERENCA:")
    print(f"   +{linhas_final - linhas_original} linhas")
    print(f"   +R$ {valor_final - valor_original:,.2f}")
    print(f"")
    print("="*80 + "\n")

    # Salvar planilha atualizada
    output_path = "Gastos_Consolidados_Flame_AUDITORIA_FINAL_COM_PDF.xlsx"
    print(f"Salvando planilha atualizada em {output_path}...")
    df_final.to_excel(output_path, index=False, sheet_name='Auditoria Gastos')
    print(f"[OK] Planilha salva!\n")

    # Gerar relatorio
    with open('output/relatorio_adicao_notas.txt', 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("RELATORIO DE ADICAO DE NOTAS\n")
        f.write("="*80 + "\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")

        f.write("--- RESUMO ---\n")
        f.write(f"Linhas originais: {linhas_original}\n")
        f.write(f"Linhas adicionadas: {len(novas_linhas)}\n")
        f.write(f"Linhas finais: {linhas_final}\n\n")

        f.write("--- VALORES ---\n")
        f.write(f"Valor original: R$ {valor_original:,.2f}\n")
        f.write(f"Valor adicionado: R$ {sum(l['VLR_TOTAL'] for l in novas_linhas):,.2f}\n")
        f.write(f"Valor final: R$ {valor_final:,.2f}\n\n")

        f.write("--- DISTRIBUICAO POR CATEGORIA ---\n")
        categorias = df_final['CATEGORIA'].value_counts()
        for cat, count in categorias.items():
            valor_cat = df_final[df_final['CATEGORIA'] == cat]['VLR_TOTAL'].sum()
            f.write(f"{cat}: {count} itens (R$ {valor_cat:,.2f})\n")

        f.write("\n--- OBSERVACOES ---\n")
        f.write("- Todas as notas identificadas na revisao manual foram adicionadas\n")
        f.write("- 40 paginas ilegiveis ainda precisam atencao manual\n")
        f.write("- Verificar valores muito altos (ex: CityLar R$ 3.660,42)\n\n")

        f.write("="*80 + "\n")

    print(f"[OK] Relatorio salvo: output/relatorio_adicao_notas.txt\n")

    print("="*80)
    print("PROCESSO CONCLUIDO!")
    print("="*80)
    print(f"\nArquivo gerado: {output_path}")
    print(f"Valor final: R$ {valor_final:,.2f}\n")

if __name__ == "__main__":
    main()
