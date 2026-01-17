"""
Script para categorizar automaticamente os itens extraídos das notas fiscais
"""

import json
import re
from pathlib import Path

# Dicionário de categorias baseado na planilha existente
CATEGORIAS = {
    "Bebidas/Insumos": [
        "cerveja", "vodka", "whisky", "whiskey", "gin", "rum", "cachaça",
        "vinho", "champagne", "espumante", "licor",
        "energético", "energetico", "redbull", "red bull",
        "refrigerante", "coca", "pepsi", "guaraná", "guarana", "sprite", "fanta",
        "suco", "juice", "água", "agua", "gelo", "limão", "limao",
        "cerveja heineken", "cerveja budweiser", "cerveja corona",
        "gás", "gas", "co2", "nitrogênio", "nitrogenio",
        "xarope", "syrup", "polpa", "fruta",
        "leite", "creme", "nata", "chocolate",
        "açúcar", "acucar", "sal", "tempero",
        "gelo cubo", "gelo barra"
    ],
    "Equipamentos": [
        "geladeira", "freezer", "frigobar", "refrigerador",
        "fog\u00e3o", "fogao", "cooktop",
        "microondas", "micro-ondas", "forno",
        "liquidificador", "mixer", "batedeira",
        "tv", "televisão", "televisao", "monitor",
        "bomba", "motor", "compressor",
        "fritadeira", "air fryer", "airfryer",
        "expositora", "vitrine", "balc\u00e3o", "balcao",
        "bancada", "mesa", "cadeira", "banqueta",
        "prateleira", "estante", "armário", "armario",
        "luminária", "luminaria", "lustre", "iluminação", "iluminacao",
        "ventilador", "climatizador", "ar condicionado", "ar-condicionado",
        "coifa", "exaustor", "depurador",
        "pia", "torneira", "cuba"
    ],
    "Aluguel Equipamento": [
        "aluguel", "locação", "locacao", "rental"
    ],
    "Frete": [
        "frete", "entrega", "transporte", "carreto",
        "frete material", "taxa de entrega", "delivery"
    ],
    "Equipamentos/TI": [
        "computador", "notebook", "laptop", "pc",
        "impressora", "scanner",
        "roteador", "modem", "switch",
        "nobreak", "estabilizador",
        "mouse", "teclado", "monitor",
        "hd", "ssd", "memória", "memoria",
        "software", "licença", "licenca"
    ],
    "Utensílios": [
        "copo", "taça", "taca", "caneca", "xícara", "xicara",
        "prato", "tigela", "bowl",
        "talher", "garfo", "faca", "colher",
        "abridor", "saca-rolha", "saca rolha",
        "shaker", "jigger", "medidor",
        "coqueteleira", "dosador",
        "bandeja", "travessa",
        "pano", "toalha", "guardanapo"
    ],
    "Limpeza": [
        "detergente", "sabão", "sabao", "desinfetante",
        "álcool", "alcool", "sanitizante",
        "esponja", "pano", "rodo", "vassoura",
        "saco de lixo", "lixeira",
        "luva", "máscara", "mascara"
    ],
    "Manutenção": [
        "manutenção", "manutencao", "reparo", "conserto",
        "peça", "peca", "componente",
        "instalação", "instalacao"
    ],
    "Decoração": [
        "decoração", "decoracao", "quadro", "placa",
        "vaso", "planta", "flor",
        "cortina", "persiana",
        "almofada", "tapete"
    ],
    "Material de Construção": [
        "cimento", "areia", "tijolo", "bloco",
        "tinta", "pintura",
        "madeira", "compensado", "mdf",
        "parafuso", "prego", "bucha",
        "cano", "tubo", "conexão", "conexao",
        "fio", "cabo", "tomada", "interruptor",
        "porta", "janela", "fechadura"
    ],
    "Serviços": [
        "serviço", "servico", "mão de obra", "mao de obra",
        "instalação", "instalacao", "montagem"
    ],
    "Diversos": [
        # Catch-all para itens que não se encaixam em outras categorias
    ]
}

def normalizar_texto(texto):
    """Normaliza texto para comparação"""
    if not texto:
        return ""
    texto = texto.lower().strip()
    # Remover acentos
    replacements = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a',
        'é': 'e', 'ê': 'e',
        'í': 'i',
        'ó': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ü': 'u',
        'ç': 'c'
    }
    for old, new in replacements.items():
        texto = texto.replace(old, new)
    return texto

def categorizar_item(descricao):
    """
    Categoriza um item baseado em sua descrição

    Args:
        descricao: Descrição do item

    Returns:
        Nome da categoria ou "Diversos" se não encontrar
    """
    if not descricao:
        return "Diversos"

    descricao_normalizada = normalizar_texto(descricao)

    # Procurar em cada categoria
    for categoria, keywords in CATEGORIAS.items():
        if categoria == "Diversos":
            continue

        for keyword in keywords:
            keyword_normalizado = normalizar_texto(keyword)
            if keyword_normalizado in descricao_normalizada:
                return categoria

    # Se não encontrou, retornar Diversos
    return "Diversos"

def categorizar_por_fornecedor(fornecedor):
    """
    Tenta inferir categoria pelo nome do fornecedor

    Args:
        fornecedor: Nome do fornecedor

    Returns:
        Nome da categoria ou None se não conseguir inferir
    """
    if not fornecedor:
        return None

    fornecedor_normalizado = normalizar_texto(fornecedor)

    # Mapeamento de fornecedores conhecidos
    fornecedores_categoria = {
        "Bebidas/Insumos": ["bar", "bebidas", "distribuidora", "cervejaria", "gelo"],
        "Equipamentos": ["eletro", "magazine", "casas bahia", "inox"],
        "Equipamentos/TI": ["mercado livre", "magazine luiza", "fast shop"],
        "Material de Construção": ["leroy", "construção", "construcao", "materiais"],
    }

    for categoria, keywords in fornecedores_categoria.items():
        for keyword in keywords:
            if keyword in fornecedor_normalizado:
                return categoria

    return None

def processar_categorizacao(input_json_path, output_json_path):
    """
    Processa arquivo JSON de notas extraídas e adiciona categorias

    Args:
        input_json_path: Caminho do arquivo JSON de entrada
        output_json_path: Caminho do arquivo JSON de saída
    """
    print(f"Carregando dados de {input_json_path}...")

    with open(input_json_path, 'r', encoding='utf-8') as f:
        notas = json.load(f)

    print(f"Categorizando {len(notas)} notas...")

    stats = {
        "total_notas": len(notas),
        "total_itens": 0,
        "itens_categorizados": 0,
        "categorias": {}
    }

    for nota in notas:
        # Se não tem itens individuais, criar um item baseado no total da nota
        if not nota.get('itens'):
            categoria = categorizar_por_fornecedor(nota.get('fornecedor'))
            if not categoria:
                # Tentar categorizar pelo fornecedor como descrição
                categoria = categorizar_item(nota.get('fornecedor'))

            nota['categoria_inferida'] = categoria
            stats['total_itens'] += 1
            stats['categorias'][categoria] = stats['categorias'].get(categoria, 0) + 1
            continue

        # Processar cada item
        for item in nota['itens']:
            categoria = categorizar_item(item.get('descricao'))
            item['categoria'] = categoria

            stats['total_itens'] += 1
            stats['itens_categorizados'] += 1
            stats['categorias'][categoria] = stats['categorias'].get(categoria, 0) + 1

    # Salvar resultado
    print(f"Salvando dados categorizados em {output_json_path}...")
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(notas, f, ensure_ascii=False, indent=2)

    # Exibir estatísticas
    print("\n=== ESTATÍSTICAS DE CATEGORIZAÇÃO ===")
    print(f"Total de notas: {stats['total_notas']}")
    print(f"Total de itens: {stats['total_itens']}")
    print(f"Itens categorizados: {stats['itens_categorizados']}")
    print("\nDistribuição por categoria:")
    for categoria, count in sorted(stats['categorias'].items(), key=lambda x: x[1], reverse=True):
        percentual = (count / stats['total_itens']) * 100
        print(f"  {categoria}: {count} ({percentual:.1f}%)")

    return stats

def main():
    input_path = Path('output/notas_extraidas_parsed.json')
    output_path = Path('output/notas_categorizadas.json')

    if not input_path.exists():
        print(f"ERRO: Arquivo {input_path} não encontrado!")
        print("Execute primeiro o script extract_invoice_data.py")
        return

    processar_categorizacao(input_path, output_path)
    print("\nCategorização concluída!")

if __name__ == "__main__":
    main()
