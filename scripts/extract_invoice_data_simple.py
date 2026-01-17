"""
Script simplificado para extrair dados das notas fiscais
Usa análise das imagens já convertidas
"""

import pdfplumber
import json
import re
from pathlib import Path
from datetime import datetime
import os

class SimpleInvoiceExtractor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.pdf = pdfplumber.open(pdf_path)
        self.notas_extraidas = []

    def extract_text_from_page(self, page):
        """Extrai texto de uma página usando pdfplumber"""
        try:
            # Tentar extrair texto direto do PDF
            text = page.extract_text()
            if text and len(text.strip()) > 50:
                return text

            # Se não conseguiu, tentar extrair de tabelas
            tables = page.extract_tables()
            if tables:
                text_from_tables = []
                for table in tables:
                    for row in table:
                        if row:
                            text_from_tables.append(' | '.join([str(cell) if cell else '' for cell in row]))
                return '\n'.join(text_from_tables)

            return ""

        except Exception as e:
            print(f"Erro ao extrair texto: {e}")
            return ""

    def extract_cnpj_cpf(self, text):
        """Extrai CNPJ ou CPF do texto"""
        # CNPJ: XX.XXX.XXX/XXXX-XX
        cnpj_pattern = r'\d{2}\.?\d{3}\.?\d{3}/?0001-?\d{2}'
        match = re.search(cnpj_pattern, text)
        if match:
            return match.group(0)

        # CPF: XXX.XXX.XXX-XX
        cpf_pattern = r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}'
        match = re.search(cpf_pattern, text)
        if match:
            return match.group(0)

        return None

    def extract_date(self, text):
        """Extrai data do texto"""
        # Padrões de data
        patterns = [
            r'(\d{2}[/-]\d{2}[/-]\d{4})',  # DD/MM/YYYY
            r'(\d{2}[/-]\d{2}[/-]\d{2})',   # DD/MM/YY
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                date_str = matches[0]
                try:
                    sep = '/' if '/' in date_str else '-'
                    parts = date_str.split(sep)
                    if len(parts[2]) == 2:  # DD/MM/YY
                        year = "20" + parts[2]
                        return f"{parts[0]}/{parts[1]}/{year}"
                    else:  # DD/MM/YYYY
                        return date_str.replace('-', '/')
                except:
                    continue
        return None

    def extract_valor_total(self, text):
        """Extrai valor total da nota"""
        # Procurar por "TOTAL" seguido de valor
        patterns = [
            r'TOTAL[^0-9]*?R?\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})',
            r'VALOR\s+TOTAL[^0-9]*?R?\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})',
            r'R\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})\s*$',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
            if matches:
                # Pegar o último valor (geralmente é o total)
                valor_str = matches[-1]
                valor_str = valor_str.replace('.', '').replace(',', '.')
                try:
                    return float(valor_str)
                except:
                    continue
        return None

    def extract_numero_nota(self, text):
        """Extrai número da nota fiscal"""
        patterns = [
            r'N[FºªCF\s]*[:\s]*(\d{4,})',
            r'N[úÚ]MERO[:\s]*(\d{4,})',
            r'CUPOM[:\s]*(\d{4,})',
            r'NFC-?e[:\s]*N[º°\s]*(\d{4,})',
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None

    def extract_fornecedor(self, text):
        """Extrai nome do fornecedor"""
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        # Procurar linhas com indicadores de razão social
        indicadores = ['LTDA', 'ME', 'EIRELI', 'S/A', 'S.A', 'EPP', 'CIA']

        for line in lines[:15]:  # Verificar primeiras 15 linhas
            line_upper = line.upper()
            if any(ind in line_upper for ind in indicadores):
                # Limpar a linha
                fornecedor = line
                # Remover CNPJ se presente
                fornecedor = re.sub(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}', '', fornecedor)
                fornecedor = fornecedor.strip()
                if len(fornecedor) > 5:
                    return fornecedor

        # Se não encontrou, pegar primeira linha não vazia com mais de 10 caracteres
        for line in lines[:10]:
            if len(line) > 10 and not line[0].isdigit():
                return line

        return None

    def extract_items_from_text(self, text):
        """Extrai itens da nota (descrição, qtd, valores)"""
        items = []
        lines = text.split('\n')

        for line in lines:
            # Padrão: descrição + quantidade + valor unitário + valor total
            # Exemplo: CERVEJA HEINEKEN 350ML    2    12,00    24,00
            pattern = r'(.+?)\s+(\d+[.,]?\d*)\s+(\d+[.,]\d{2})\s+(\d+[.,]\d{2})'
            match = re.search(pattern, line)

            if match:
                descricao = match.group(1).strip()
                # Limpar códigos e números do início da descrição
                descricao = re.sub(r'^\d+\s*', '', descricao)

                try:
                    quantidade = float(match.group(2).replace(',', '.'))
                    valor_unit = float(match.group(3).replace(',', '.'))
                    valor_total = float(match.group(4).replace(',', '.'))

                    # Validar que faz sentido
                    if abs(quantidade * valor_unit - valor_total) < 0.02:
                        items.append({
                            'descricao': descricao,
                            'quantidade': quantidade,
                            'valor_unitario': valor_unit,
                            'valor_total': valor_total
                        })
                except:
                    continue

        return items if items else None

    def process_page(self, page_num):
        """Processa uma página do PDF"""
        print(f"Processando página {page_num + 1}/{len(self.pdf.pages)}...")

        try:
            page = self.pdf.pages[page_num]
            text = self.extract_text_from_page(page)

            if not text or len(text.strip()) < 20:
                print(f"  [!] Pagina {page_num + 1}: Pouco ou nenhum texto extraido")
                return {
                    'pagina_pdf': page_num + 1,
                    'erro': 'Texto insuficiente',
                    'texto_raw': text
                }

            # Extrair informações
            nota_data = {
                'pagina_pdf': page_num + 1,
                'texto_raw': text[:500],  # Primeiros 500 caracteres para referência
                'fornecedor': self.extract_fornecedor(text),
                'cnpj': self.extract_cnpj_cpf(text),
                'data': self.extract_date(text),
                'numero_nota': self.extract_numero_nota(text),
                'valor_total': self.extract_valor_total(text),
                'itens': self.extract_items_from_text(text)
            }

            # Exibir resumo
            if nota_data['fornecedor']:
                print(f"  [OK] Fornecedor: {nota_data['fornecedor'][:40]}...")
            if nota_data['valor_total']:
                print(f"  [OK] Valor: R$ {nota_data['valor_total']:.2f}")
            if nota_data['data']:
                print(f"  [OK] Data: {nota_data['data']}")

            return nota_data

        except Exception as e:
            print(f"  [ERRO] Erro ao processar pagina {page_num + 1}: {e}")
            return {
                'pagina_pdf': page_num + 1,
                'erro': str(e),
                'texto_raw': None
            }

    def process_all_pages(self, max_pages=None):
        """Processa todas as páginas do PDF"""
        total_pages = len(self.pdf.pages)
        if max_pages:
            total_pages = min(total_pages, max_pages)

        print(f"\nIniciando extração de {total_pages} páginas...\n")

        for page_num in range(total_pages):
            nota_data = self.process_page(page_num)
            self.notas_extraidas.append(nota_data)

            # Salvar progresso a cada 10 páginas
            if (page_num + 1) % 10 == 0:
                self.save_intermediate_results()
                print(f"\n[OK] Progresso salvo ({page_num + 1}/{total_pages} páginas)\n")

        print("\n[OK] Extração concluída!")
        return self.notas_extraidas

    def save_intermediate_results(self):
        """Salva resultados intermediários"""
        output_dir = Path('output')
        output_dir.mkdir(exist_ok=True)

        with open(output_dir / 'notas_extraidas_raw.json', 'w', encoding='utf-8') as f:
            json.dump(self.notas_extraidas, f, ensure_ascii=False, indent=2)

    def save_final_results(self):
        """Salva resultados finais"""
        output_dir = Path('output')
        output_dir.mkdir(exist_ok=True)

        # Salvar dados brutos
        with open(output_dir / 'notas_extraidas_raw.json', 'w', encoding='utf-8') as f:
            json.dump(self.notas_extraidas, f, ensure_ascii=False, indent=2)

        # Criar versão estruturada (apenas dados relevantes)
        notas_parsed = []
        stats = {
            'total_paginas': len(self.notas_extraidas),
            'com_fornecedor': 0,
            'com_data': 0,
            'com_valor': 0,
            'com_items': 0,
            'com_erro': 0
        }

        for nota in self.notas_extraidas:
            if nota.get('erro'):
                stats['com_erro'] += 1
                continue

            if nota.get('fornecedor'):
                stats['com_fornecedor'] += 1
            if nota.get('data'):
                stats['com_data'] += 1
            if nota.get('valor_total'):
                stats['com_valor'] += 1
            if nota.get('itens'):
                stats['com_items'] += 1

            parsed = {
                'pagina_pdf': nota['pagina_pdf'],
                'fornecedor': nota.get('fornecedor'),
                'cnpj': nota.get('cnpj'),
                'data': nota.get('data'),
                'numero_nota': nota.get('numero_nota'),
                'valor_total': nota.get('valor_total'),
                'itens': nota.get('itens') or []
            }
            notas_parsed.append(parsed)

        with open(output_dir / 'notas_extraidas_parsed.json', 'w', encoding='utf-8') as f:
            json.dump(notas_parsed, f, ensure_ascii=False, indent=2)

        # Exibir estatísticas
        print(f"\n{'='*60}")
        print("ESTATÍSTICAS DA EXTRAÇÃO")
        print(f"{'='*60}")
        print(f"Total de páginas processadas: {stats['total_paginas']}")
        print(f"Páginas com erro: {stats['com_erro']}")
        print(f"Notas com fornecedor identificado: {stats['com_fornecedor']}")
        print(f"Notas com data identificada: {stats['com_data']}")
        print(f"Notas com valor total: {stats['com_valor']}")
        print(f"Notas com itens detalhados: {stats['com_items']}")
        print(f"{'='*60}\n")

        print(f"[OK] Resultados salvos em {output_dir}/")
        print(f"  - notas_extraidas_raw.json")
        print(f"  - notas_extraidas_parsed.json")

def main():
    pdf_path = "Notas Flame.pdf"

    if not os.path.exists(pdf_path):
        print(f"ERRO: Arquivo {pdf_path} não encontrado!")
        return

    print("="*60)
    print("EXTRAÇÃO DE DADOS DE NOTAS FISCAIS")
    print("="*60)
    print(f"Arquivo: {pdf_path}")
    print("Método: Extração de texto direta (pdfplumber)")
    print("="*60)

    extractor = SimpleInvoiceExtractor(pdf_path)

    # Para teste, processar apenas primeiras páginas
    # extractor.process_all_pages(max_pages=10)

    # Para produção, processar todas
    extractor.process_all_pages()

    extractor.save_final_results()

if __name__ == "__main__":
    main()
