"""
Script para extrair dados das notas fiscais usando análise visual
Processa imagens das páginas e usa prompts estruturados
"""

import pdfplumber
import json
import os
from pathlib import Path
import time

class VisionInvoiceExtractor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.pdf = pdfplumber.open(pdf_path)
        self.notas_extraidas = []
        self.output_dir = Path('output')
        self.output_dir.mkdir(exist_ok=True)

    def convert_page_to_image(self, page_num):
        """Converte página do PDF para imagem PNG"""
        try:
            page = self.pdf.pages[page_num]
            im = page.to_image(resolution=150)

            # Salvar imagem
            image_path = self.output_dir / f'page_{page_num + 1:03d}.png'
            im.save(image_path)

            return str(image_path)

        except Exception as e:
            print(f"  [ERRO] Erro ao converter pagina {page_num + 1}: {e}")
            return None

    def create_extraction_prompt(self):
        """Cria o prompt para extração de dados"""
        return """Analise esta imagem de nota fiscal/cupom fiscal e extraia as seguintes informações em formato JSON:

{
  "fornecedor": "Nome completo do fornecedor/estabelecimento",
  "cnpj_cpf": "CNPJ ou CPF (formato XX.XXX.XXX/XXXX-XX ou XXX.XXX.XXX-XX)",
  "data": "Data da nota no formato DD/MM/YYYY",
  "numero_nota": "Número da nota fiscal ou cupom",
  "valor_total": 123.45,
  "itens": [
    {
      "descricao": "Nome do produto/item",
      "quantidade": 1.0,
      "valor_unitario": 10.00,
      "valor_total": 10.00
    }
  ]
}

INSTRUÇÕES:
1. Se a imagem contiver múltiplos cupons/notas, extraia APENAS o primeiro
2. Para "valor_total", use número decimal (ex: 123.45)
3. Se não conseguir identificar algum campo, use null
4. Para itens, extraia o máximo de detalhes da tabela de produtos
5. Se não conseguir ler, retorne: {"erro": "Imagem ilegível"}

Retorne APENAS o JSON, sem texto adicional."""

    def process_page(self, page_num):
        """Processa uma página do PDF"""
        print(f"\nProcessando pagina {page_num + 1}/{len(self.pdf.pages)}...")

        # Converter para imagem
        image_path = self.convert_page_to_image(page_num)
        if not image_path:
            return {
                'pagina_pdf': page_num + 1,
                'erro': 'Falha ao converter imagem',
                'image_path': None
            }

        print(f"  [OK] Imagem salva: {image_path}")

        # Retornar referência da imagem para processamento posterior
        return {
            'pagina_pdf': page_num + 1,
            'image_path': image_path,
            'status': 'imagem_pronta'
        }

    def process_all_pages(self):
        """Converte todas as páginas para imagens"""
        total_pages = len(self.pdf.pages)

        print(f"{'='*60}")
        print(f"Convertendo {total_pages} paginas para imagens...")
        print(f"{'='*60}\n")

        for page_num in range(total_pages):
            try:
                nota_data = self.process_page(page_num)
                self.notas_extraidas.append(nota_data)

                # Salvar progresso a cada 20 páginas
                if (page_num + 1) % 20 == 0:
                    print(f"\n[OK] Progresso: {page_num + 1}/{total_pages} paginas convertidas\n")

            except KeyboardInterrupt:
                print("\n[!] Processamento interrompido")
                break
            except Exception as e:
                print(f"[ERRO] Erro na pagina {page_num + 1}: {e}")
                self.notas_extraidas.append({
                    'pagina_pdf': page_num + 1,
                    'erro': str(e)
                })

        print(f"\n{'='*60}")
        print(f"[OK] Conversao concluida: {len(self.notas_extraidas)} paginas")
        print(f"{'='*60}\n")

        return self.notas_extraidas

    def save_results(self):
        """Salva lista de imagens para processamento"""
        images_list = []

        for nota in self.notas_extraidas:
            if nota.get('image_path'):
                images_list.append({
                    'pagina': nota['pagina_pdf'],
                    'image_path': nota['image_path'],
                    'status': 'pendente'
                })

        # Salvar lista
        list_path = self.output_dir / 'images_list.json'
        with open(list_path, 'w', encoding='utf-8') as f:
            json.dump(images_list, f, ensure_ascii=False, indent=2)

        print(f"[OK] Lista de imagens salva em: {list_path}")
        print(f"Total de imagens: {len(images_list)}")

        # Salvar prompt de extração
        prompt_path = self.output_dir / 'extraction_prompt.txt'
        with open(prompt_path, 'w', encoding='utf-8') as f:
            f.write(self.create_extraction_prompt())

        print(f"[OK] Prompt salvo em: {prompt_path}")

        return images_list

def main():
    pdf_path = "Notas Flame.pdf"

    if not os.path.exists(pdf_path):
        print(f"ERRO: Arquivo {pdf_path} nao encontrado!")
        return

    print("="*60)
    print("PREPARACAO PARA EXTRACAO DE DADOS")
    print("="*60)
    print(f"Arquivo: {pdf_path}")
    print("Etapa 1: Converter paginas para imagens")
    print("="*60 + "\n")

    extractor = VisionInvoiceExtractor(pdf_path)
    extractor.process_all_pages()
    extractor.save_results()

    print("\n" + "="*60)
    print("PROXIMOS PASSOS:")
    print("="*60)
    print("As imagens foram salvas em output/")
    print("Execute o script de analise visual para extrair os dados")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
