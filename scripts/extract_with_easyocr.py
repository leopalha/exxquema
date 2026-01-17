"""
Script para extrair dados das notas fiscais usando EasyOCR
Processa as imagens já convertidas
"""

import easyocr
import json
import re
from pathlib import Path
from datetime import datetime

class EasyOCRInvoiceExtractor:
    def __init__(self, images_dir='output'):
        self.images_dir = Path(images_dir)
        self.notas_extraidas = []

        print("Inicializando EasyOCR (pode demorar alguns segundos)...")
        self.reader = easyocr.Reader(['pt'], gpu=False)
        print("[OK] EasyOCR iniciado!\n")

    def extract_text_from_image(self, image_path):
        """Extrai texto de uma imagem usando EasyOCR"""
        try:
            result = self.reader.readtext(str(image_path), detail=0)
            text = '\n'.join(result)
            return text
        except Exception as e:
            print(f"  [ERRO] Erro ao ler imagem: {e}")
            return ""

    def extract_cnpj_cpf(self, text):
        """Extrai CNPJ ou CPF do texto"""
        # CNPJ
        cnpj_pattern = r'\d{2}\.?\d{3}\.?\d{3}/?0001-?\d{2}'
        match = re.search(cnpj_pattern, text)
        if match:
            return match.group(0)

        # CPF
        cpf_pattern = r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}'
        match = re.search(cpf_pattern, text)
        if match:
            return match.group(0)

        return None

    def extract_date(self, text):
        """Extrai data do texto"""
        patterns = [
            r'(\d{2}[/-]\d{2}[/-]\d{4})',
            r'(\d{2}[/-]\d{2}[/-]\d{2})',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                date_str = matches[0]
                try:
                    sep = '/' if '/' in date_str else '-'
                    parts = date_str.split(sep)
                    if len(parts[2]) == 2:
                        year = "20" + parts[2]
                        return f"{parts[0]}/{parts[1]}/{year}"
                    else:
                        return date_str.replace('-', '/')
                except:
                    continue
        return None

    def extract_valor_total(self, text):
        """Extrai valor total"""
        patterns = [
            r'TOTAL[^0-9]*?R?\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})',
            r'VALOR\s+TOTAL[^0-9]*?R?\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2})',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                valor_str = matches[-1].replace('.', '').replace(',', '.')
                try:
                    return float(valor_str)
                except:
                    continue
        return None

    def extract_numero_nota(self, text):
        """Extrai número da nota"""
        patterns = [
            r'N[FºªCF\s]*[:\s]*(\d{4,})',
            r'NFC-?e[:\s]*N[º°\s]*(\d{4,})',
            r'CUPOM[:\s]*(\d{4,})',
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None

    def extract_fornecedor(self, text):
        """Extrai fornecedor"""
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        indicadores = ['LTDA', 'ME', 'EIRELI', 'S/A', 'S.A', 'EPP']

        for line in lines[:15]:
            line_upper = line.upper()
            if any(ind in line_upper for ind in indicadores):
                fornecedor = line
                fornecedor = re.sub(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}', '', fornecedor)
                fornecedor = fornecedor.strip()
                if len(fornecedor) > 5:
                    return fornecedor

        for line in lines[:10]:
            if len(line) > 10 and not line[0].isdigit():
                return line

        return None

    def process_image(self, image_path, page_num):
        """Processa uma imagem"""
        print(f"Processando pagina {page_num}...")

        try:
            # Extrair texto
            text = self.extract_text_from_image(image_path)

            if not text or len(text.strip()) < 20:
                print(f"  [!] Pouco texto extraido")
                return {
                    'pagina_pdf': page_num,
                    'erro': 'Texto insuficiente'
                }

            # Extrair dados
            nota_data = {
                'pagina_pdf': page_num,
                'fornecedor': self.extract_fornecedor(text),
                'cnpj': self.extract_cnpj_cpf(text),
                'data': self.extract_date(text),
                'numero_nota': self.extract_numero_nota(text),
                'valor_total': self.extract_valor_total(text),
                'itens': []  # EasyOCR não extrai itens estruturados facilmente
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
            print(f"  [ERRO] {e}")
            return {
                'pagina_pdf': page_num,
                'erro': str(e)
            }

    def process_all_images(self):
        """Processa todas as imagens"""
        # Listar todas as imagens
        images = sorted(self.images_dir.glob('page_*.png'))
        total = len(images)

        print(f"{'='*60}")
        print(f"Processando {total} imagens com EasyOCR...")
        print(f"{'='*60}\n")

        for idx, image_path in enumerate(images, 1):
            nota_data = self.process_image(image_path, idx)
            self.notas_extraidas.append(nota_data)

            # Salvar progresso a cada 10 imagens
            if idx % 10 == 0:
                self.save_intermediate_results()
                print(f"\n[OK] Progresso salvo ({idx}/{total})\n")

        print(f"\n{'='*60}")
        print(f"[OK] Processamento concluido: {len(self.notas_extraidas)} notas")
        print(f"{'='*60}\n")

    def save_intermediate_results(self):
        """Salva progresso"""
        with open(self.images_dir / 'notas_extraidas_raw.json', 'w', encoding='utf-8') as f:
            json.dump(self.notas_extraidas, f, ensure_ascii=False, indent=2)

    def save_final_results(self):
        """Salva resultados finais"""
        # Raw
        with open(self.images_dir / 'notas_extraidas_raw.json', 'w', encoding='utf-8') as f:
            json.dump(self.notas_extraidas, f, ensure_ascii=False, indent=2)

        # Parsed
        notas_parsed = []
        stats = {
            'total': len(self.notas_extraidas),
            'com_fornecedor': 0,
            'com_data': 0,
            'com_valor': 0,
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

            notas_parsed.append({
                'pagina_pdf': nota['pagina_pdf'],
                'fornecedor': nota.get('fornecedor'),
                'cnpj': nota.get('cnpj'),
                'data': nota.get('data'),
                'numero_nota': nota.get('numero_nota'),
                'valor_total': nota.get('valor_total'),
                'itens': []
            })

        with open(self.images_dir / 'notas_extraidas_parsed.json', 'w', encoding='utf-8') as f:
            json.dump(notas_parsed, f, ensure_ascii=False, indent=2)

        # Estatísticas
        print(f"{'='*60}")
        print("ESTATISTICAS")
        print(f"{'='*60}")
        print(f"Total: {stats['total']}")
        print(f"Com fornecedor: {stats['com_fornecedor']}")
        print(f"Com data: {stats['com_data']}")
        print(f"Com valor: {stats['com_valor']}")
        print(f"Com erro: {stats['com_erro']}")
        print(f"{'='*60}\n")

        print("[OK] Arquivos salvos:")
        print("  - output/notas_extraidas_raw.json")
        print("  - output/notas_extraidas_parsed.json")

def main():
    extractor = EasyOCRInvoiceExtractor()
    extractor.process_all_images()
    extractor.save_final_results()

if __name__ == "__main__":
    main()
