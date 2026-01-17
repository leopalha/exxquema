"""
Script para extrair dados das notas fiscais usando OCR
Processa o PDF página por página e extrai informações estruturadas
"""

import pdfplumber
import pytesseract
from PIL import Image
import re
import json
from datetime import datetime
from pathlib import Path
import os

# Configurar Tesseract para português
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# Configurar diretório de dados do Tesseract para usar tessdata local
os.environ['TESSDATA_PREFIX'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'tessdata')

class InvoiceExtractor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.pdf = pdfplumber.open(pdf_path)
        self.notas_extraidas = []

    def extract_cnpj(self, text):
        """Extrai CNPJ do texto"""
        # Padrão: XX.XXX.XXX/XXXX-XX
        pattern = r'\d{2}\.?\d{3}\.?\d{3}/?0001-?\d{2}'
        match = re.search(pattern, text)
        return match.group(0) if match else None

    def extract_cpf(self, text):
        """Extrai CPF do texto"""
        # Padrão: XXX.XXX.XXX-XX
        pattern = r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}'
        match = re.search(pattern, text)
        return match.group(0) if match else None

    def extract_date(self, text):
        """Extrai data do texto - vários formatos"""
        # Tentar vários padrões de data
        patterns = [
            r'(\d{2}[/-]\d{2}[/-]\d{4})',  # DD/MM/YYYY ou DD-MM-YYYY
            r'(\d{2}[/-]\d{2}[/-]\d{2})',   # DD/MM/YY ou DD-MM-YY
            r'(\d{4}-\d{2}-\d{2})',          # YYYY-MM-DD
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Retornar a primeira data encontrada
                date_str = matches[0]
                try:
                    # Tentar converter para formato padrão
                    if '/' in date_str or '-' in date_str:
                        sep = '/' if '/' in date_str else '-'
                        parts = date_str.split(sep)
                        if len(parts[0]) == 4:  # YYYY-MM-DD
                            return f"{parts[2]}/{parts[1]}/{parts[0]}"
                        elif len(parts[2]) == 2:  # DD/MM/YY
                            year = "20" + parts[2]
                            return f"{parts[0]}/{parts[1]}/{year}"
                        else:  # DD/MM/YYYY
                            return date_str.replace('-', '/')
                except:
                    continue
        return None

    def extract_valor(self, text, keyword="TOTAL"):
        """Extrai valor monetário após uma palavra-chave"""
        # Procurar por valor após keyword
        pattern = f'{keyword}[^0-9]*([0-9]+[.,][0-9]{{2}})'
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            valor_str = match.group(1).replace('.', '').replace(',', '.')
            try:
                return float(valor_str)
            except:
                pass

        # Se não encontrou, procurar por qualquer valor monetário no final
        pattern = r'R\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})'
        matches = re.findall(pattern, text)
        if matches:
            valor_str = matches[-1].replace('.', '').replace(',', '.')
            try:
                return float(valor_str)
            except:
                pass

        return None

    def extract_numero_nota(self, text):
        """Extrai número da nota fiscal"""
        # Padrões comuns
        patterns = [
            r'N[FºªCF\s]*[:\s]*(\d+)',
            r'N[úÚ]MERO[:\s]*(\d+)',
            r'CUPOM[:\s]*(\d+)',
            r'DOCUMENTO[:\s]*(\d+)',
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None

    def extract_fornecedor(self, text):
        """Extrai nome do fornecedor (primeira linha geralmente)"""
        lines = text.split('\n')
        for line in lines[:10]:  # Verificar primeiras 10 linhas
            line = line.strip()
            # Procurar linha com razão social (geralmente tem palavras como LTDA, ME, EIRELI, etc)
            if any(palavra in line.upper() for palavra in ['LTDA', 'ME', 'EIRELI', 'S/A', 'S.A', 'EPP']):
                return line
            # Ou linhas longas que parecem ser nome de empresa
            if len(line) > 10 and not any(char.isdigit() for char in line[:5]):
                return line
        return None

    def extract_items(self, text):
        """Extrai itens da nota fiscal (descrição, quantidade, valor)"""
        items = []
        lines = text.split('\n')

        for line in lines:
            # Procurar linhas com padrão: descrição + quantidade + valor
            # Exemplo: "CERVEJA HEINEKEN 2 12.00 24.00"
            pattern = r'(.+?)\s+(\d+[.,]?\d*)\s+(\d+[.,]\d{2})\s+(\d+[.,]\d{2})'
            match = re.search(pattern, line)
            if match:
                descricao = match.group(1).strip()
                quantidade = float(match.group(2).replace(',', '.'))
                valor_unit = float(match.group(3).replace(',', '.'))
                valor_total = float(match.group(4).replace(',', '.'))

                items.append({
                    'descricao': descricao,
                    'quantidade': quantidade,
                    'valor_unitario': valor_unit,
                    'valor_total': valor_total
                })

        return items if items else None

    def process_page(self, page_num):
        """Processa uma página do PDF"""
        print(f"Processando página {page_num + 1}/{ len(self.pdf.pages)}...")

        try:
            page = self.pdf.pages[page_num]

            # Converter página para imagem
            im = page.to_image(resolution=300)
            pil_image = im.original

            # Aplicar OCR
            text = pytesseract.image_to_string(pil_image, lang='por', config='--psm 6')

            # Extrair informações
            nota_data = {
                'pagina_pdf': page_num + 1,
                'texto_raw': text,
                'fornecedor': self.extract_fornecedor(text),
                'cnpj': self.extract_cnpj(text),
                'cpf': self.extract_cpf(text),
                'data': self.extract_date(text),
                'numero_nota': self.extract_numero_nota(text),
                'valor_total': self.extract_valor(text),
                'itens': self.extract_items(text),
                'ocr_confidence': 'PENDING'  # Será calculado depois
            }

            # Salvar imagem se confiança baixa (implementar depois)
            # if confidence < 70:
            #     im.save(f'output/notas_baixa_qualidade/page_{page_num + 1}.png')

            return nota_data

        except Exception as e:
            print(f"Erro ao processar página {page_num + 1}: {e}")
            return {
                'pagina_pdf': page_num + 1,
                'erro': str(e),
                'texto_raw': None
            }

    def process_all_pages(self):
        """Processa todas as páginas do PDF"""
        total_pages = len(self.pdf.pages)
        print(f"Iniciando extração de {total_pages} páginas...")

        for page_num in range(total_pages):
            nota_data = self.process_page(page_num)
            self.notas_extraidas.append(nota_data)

            # Salvar progresso a cada 10 páginas
            if (page_num + 1) % 10 == 0:
                self.save_intermediate_results()

        print("Extração concluída!")
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
        for nota in self.notas_extraidas:
            if nota.get('erro'):
                continue

            parsed = {
                'pagina_pdf': nota['pagina_pdf'],
                'fornecedor': nota.get('fornecedor'),
                'cnpj': nota.get('cnpj') or nota.get('cpf'),
                'data': nota.get('data'),
                'numero_nota': nota.get('numero_nota'),
                'valor_total': nota.get('valor_total'),
                'itens': nota.get('itens') or []
            }
            notas_parsed.append(parsed)

        with open(output_dir / 'notas_extraidas_parsed.json', 'w', encoding='utf-8') as f:
            json.dump(notas_parsed, f, ensure_ascii=False, indent=2)

        print(f"Resultados salvos em {output_dir}/")
        print(f"Total de notas processadas: {len(self.notas_extraidas)}")
        print(f"Notas com dados estruturados: {len(notas_parsed)}")

def main():
    # Verificar se Tesseract está instalado
    try:
        pytesseract.get_tesseract_version()
    except:
        print("ERRO: Tesseract OCR não encontrado!")
        print("Instale o Tesseract de: https://github.com/UB-Mannheim/tesseract/wiki")
        return

    # Processar PDF
    pdf_path = "Notas Flame.pdf"
    if not os.path.exists(pdf_path):
        print(f"ERRO: Arquivo {pdf_path} não encontrado!")
        return

    extractor = InvoiceExtractor(pdf_path)
    extractor.process_all_pages()
    extractor.save_final_results()

if __name__ == "__main__":
    main()
