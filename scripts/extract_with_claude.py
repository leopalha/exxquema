"""
Script para extrair dados das notas fiscais usando Claude Vision API
Analisa visualmente cada página do PDF
"""

import pdfplumber
import json
import base64
import os
from pathlib import Path
from anthropic import Anthropic
import time

class ClaudeInvoiceExtractor:
    def __init__(self, pdf_path, api_key=None):
        self.pdf_path = pdf_path
        self.pdf = pdfplumber.open(pdf_path)
        self.notas_extraidas = []

        # Inicializar cliente Anthropic
        self.client = Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))

    def convert_page_to_image(self, page_num):
        """Converte página do PDF para imagem em base64"""
        try:
            page = self.pdf.pages[page_num]
            # Converter para imagem com resolução moderada (150 DPI é suficiente)
            im = page.to_image(resolution=150)

            # Salvar temporariamente
            temp_path = Path(f'output/temp_page_{page_num}.png')
            im.save(temp_path)

            # Ler e converter para base64
            with open(temp_path, 'rb') as f:
                image_data = base64.standard_b64encode(f.read()).decode('utf-8')

            # Remover arquivo temporário
            temp_path.unlink()

            return image_data

        except Exception as e:
            print(f"  [ERRO] Erro ao converter pagina {page_num + 1}: {e}")
            return None

    def analyze_invoice_with_claude(self, image_base64, page_num):
        """Usa Claude Vision para extrair dados da nota fiscal"""

        prompt = """Analise esta imagem de nota fiscal/cupom fiscal e extraia as seguintes informações em formato JSON:

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

INSTRUÇÕES IMPORTANTES:
1. Se a imagem contiver múltiplos cupons/notas, extraia APENAS o primeiro visível
2. Para "valor_total", use número decimal (ex: 123.45, não "R$ 123,45")
3. Se não conseguir identificar algum campo, use null
4. Para itens, tente extrair o máximo de detalhes possível da tabela de produtos
5. Se não conseguir ler a imagem, retorne: {"erro": "Imagem ilegível"}

Retorne APENAS o JSON, sem texto adicional."""

        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/png",
                                    "data": image_base64
                                }
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ]
            )

            # Extrair JSON da resposta
            response_text = response.content[0].text.strip()

            # Remover markdown se presente
            if response_text.startswith('```json'):
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif response_text.startswith('```'):
                response_text = response_text.split('```')[1].split('```')[0].strip()

            data = json.loads(response_text)
            data['pagina_pdf'] = page_num + 1

            return data

        except json.JSONDecodeError as e:
            print(f"  [ERRO] Erro ao parsear JSON da pagina {page_num + 1}: {e}")
            print(f"  Resposta: {response_text[:200]}")
            return {
                'pagina_pdf': page_num + 1,
                'erro': 'Erro ao parsear JSON',
                'resposta_raw': response_text[:500]
            }
        except Exception as e:
            print(f"  [ERRO] Erro na API Claude para pagina {page_num + 1}: {e}")
            return {
                'pagina_pdf': page_num + 1,
                'erro': str(e)
            }

    def process_page(self, page_num):
        """Processa uma página do PDF"""
        print(f"Processando pagina {page_num + 1}/{len(self.pdf.pages)}...")

        # Converter para imagem
        image_base64 = self.convert_page_to_image(page_num)
        if not image_base64:
            return {
                'pagina_pdf': page_num + 1,
                'erro': 'Falha ao converter imagem'
            }

        # Analisar com Claude
        nota_data = self.analyze_invoice_with_claude(image_base64, page_num)

        # Exibir resumo
        if not nota_data.get('erro'):
            if nota_data.get('fornecedor'):
                fornecedor = nota_data['fornecedor'][:40]
                print(f"  [OK] Fornecedor: {fornecedor}...")
            if nota_data.get('valor_total'):
                print(f"  [OK] Valor: R$ {nota_data['valor_total']:.2f}")
            if nota_data.get('data'):
                print(f"  [OK] Data: {nota_data['data']}")
            if nota_data.get('itens'):
                print(f"  [OK] Itens: {len(nota_data['itens'])} produtos")

        # Aguardar um pouco para evitar rate limiting
        time.sleep(0.5)

        return nota_data

    def process_all_pages(self, start_page=0, max_pages=None):
        """Processa todas as páginas do PDF"""
        total_pages = len(self.pdf.pages)
        if max_pages:
            total_pages = min(start_page + max_pages, total_pages)

        print(f"\nIniciando extracao de paginas {start_page + 1} ate {total_pages}...\n")

        for page_num in range(start_page, total_pages):
            try:
                nota_data = self.process_page(page_num)
                self.notas_extraidas.append(nota_data)

                # Salvar progresso a cada 10 páginas
                if (len(self.notas_extraidas)) % 10 == 0:
                    self.save_intermediate_results()
                    print(f"\n[OK] Progresso salvo ({len(self.notas_extraidas)} paginas processadas)\n")

            except KeyboardInterrupt:
                print("\n\n[!] Processamento interrompido pelo usuario")
                print(f"Paginas processadas ate agora: {len(self.notas_extraidas)}")
                self.save_intermediate_results()
                break
            except Exception as e:
                print(f"[ERRO] Erro inesperado na pagina {page_num + 1}: {e}")
                self.notas_extraidas.append({
                    'pagina_pdf': page_num + 1,
                    'erro': str(e)
                })

        print(f"\n[OK] Extracao concluida! Total: {len(self.notas_extraidas)} paginas")
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

        # Criar versão estruturada
        notas_parsed = []
        stats = {
            'total_paginas': len(self.notas_extraidas),
            'com_fornecedor': 0,
            'com_data': 0,
            'com_valor': 0,
            'com_itens': 0,
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
            if nota.get('itens') and len(nota['itens']) > 0:
                stats['com_itens'] += 1

            parsed = {
                'pagina_pdf': nota['pagina_pdf'],
                'fornecedor': nota.get('fornecedor'),
                'cnpj': nota.get('cnpj_cpf'),
                'data': nota.get('data'),
                'numero_nota': nota.get('numero_nota'),
                'valor_total': nota.get('valor_total'),
                'itens': nota.get('itens', [])
            }
            notas_parsed.append(parsed)

        with open(output_dir / 'notas_extraidas_parsed.json', 'w', encoding='utf-8') as f:
            json.dump(notas_parsed, f, ensure_ascii=False, indent=2)

        # Exibir estatísticas
        print(f"\n{'='*60}")
        print("ESTATISTICAS DA EXTRACAO")
        print(f"{'='*60}")
        print(f"Total de paginas processadas: {stats['total_paginas']}")
        print(f"Paginas com erro: {stats['com_erro']}")
        print(f"Notas com fornecedor identificado: {stats['com_fornecedor']}")
        print(f"Notas com data identificada: {stats['com_data']}")
        print(f"Notas com valor total: {stats['com_valor']}")
        print(f"Notas com itens detalhados: {stats['com_itens']}")
        print(f"{'='*60}\n")

        print(f"[OK] Resultados salvos em {output_dir}/")
        print(f"  - notas_extraidas_raw.json")
        print(f"  - notas_extraidas_parsed.json")

def main():
    pdf_path = "Notas Flame.pdf"

    if not os.path.exists(pdf_path):
        print(f"ERRO: Arquivo {pdf_path} nao encontrado!")
        return

    # Verificar API key
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERRO: ANTHROPIC_API_KEY nao configurada!")
        print("Configure a variavel de ambiente ANTHROPIC_API_KEY")
        return

    print("="*60)
    print("EXTRACAO DE DADOS DE NOTAS FISCAIS")
    print("="*60)
    print(f"Arquivo: {pdf_path}")
    print("Metodo: Claude Vision API (OCR visual)")
    print("="*60)

    extractor = ClaudeInvoiceExtractor(pdf_path)

    # Para teste, processar apenas primeiras 5 páginas
    # extractor.process_all_pages(max_pages=5)

    # Para produção, processar todas (pode demorar ~30-40 minutos)
    extractor.process_all_pages()

    extractor.save_final_results()

if __name__ == "__main__":
    main()
