/**
 * Script para migrar produtos em BATCHES (lotes) para evitar timeout
 * Execução: node scripts/migrate-products-batch.js
 */

const axios = require('axios');
const path = require('path');

// Importar mockData.js do frontend
const mockDataPath = path.join(__dirname, '../../frontend/src/data/mockData.js');

// Função para extrair produtos do arquivo mockData.js
function loadMockProducts() {
  try {
    const fs = require('fs');
    const fileContent = fs.readFileSync(mockDataPath, 'utf8');
    const match = fileContent.match(/export const mockProducts = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('Não foi possível encontrar mockProducts no arquivo');
    }
    const mockProductsStr = match[1];
    const mockProducts = eval(mockProductsStr);
    console.log(`✅ ${mockProducts.length} produtos carregados do mockData.js\n`);
    return mockProducts;
  } catch (error) {
    console.error('❌ Erro ao carregar mockData.js:', error.message);
    process.exit(1);
  }
}

// URL da API
const API_URL = process.env.API_URL || 'https://backend-production-28c3.up.railway.app';
const SEED_KEY = 'FLAME2024SEED';
const BATCH_SIZE = 10; // Produtos por batch

// Mapeamento de categorias
const categoryMap = {
  'Drinks Clássicos': 'bebidas_alcoolicas',
  'Signature Drinks': 'drinks_autorais',
  'Drinks Tropicais': 'bebidas_alcoolicas',
  'Coquetéis Zero': 'bebidas_nao_alcoolicas',
  'Petiscos': 'petiscos',
  'Pratos Principais': 'pratos_principais',
  'Sobremesas': 'sobremesas',
  'Bebidas sem Álcool': 'bebidas_nao_alcoolicas',
  'Cervejas': 'bebidas_alcoolicas',
  'Vinhos': 'bebidas_alcoolicas',
  'Destilados': 'bebidas_alcoolicas',
  'Narguilés': 'narguiles',
  'Combos': 'combos',
  'Porções': 'petiscos'
};

async function migrateInBatches() {
  console.log('🌱 Iniciando migração de produtos EM LOTES...\n');
  console.log(`🎯 API: ${API_URL}`);
  console.log(`📦 Tamanho do lote: ${BATCH_SIZE} produtos\n`);

  // Carregar produtos
  const mockProducts = loadMockProducts();

  // Converter para formato do banco
  const productsToSeed = mockProducts.map((mockProduct, i) => ({
    name: mockProduct.nome,
    description: mockProduct.descricao || '',
    price: parseFloat(mockProduct.preco),
    category: categoryMap[mockProduct.categoria] || 'bebidas_alcoolicas',
    subcategory: mockProduct.categoria,
    // image: mockProduct.imagem || null, // REMOVIDO: paths locais não passam na validação isUrl
    ingredients: mockProduct.ingredientes || '',
    tags: Array.isArray(mockProduct.tags) ? mockProduct.tags : [],
    allergens: mockProduct.alergenos ? (Array.isArray(mockProduct.alergenos) ? mockProduct.alergenos : [mockProduct.alergenos]) : [],
    dietary: mockProduct.dietetico ? (Array.isArray(mockProduct.dietetico) ? mockProduct.dietetico : [mockProduct.dietetico]) : [],
    preparationTime: mockProduct.tempoPreparo || 15,
    calories: mockProduct.calorias || null,
    isActive: mockProduct.disponivel !== false,
    isFeatured: mockProduct.destaque || false,
    hasStock: mockProduct.estoque !== undefined,
    stock: mockProduct.estoque || 50,
    minStock: 5,
    position: i + 1,
    isSignature: mockProduct.assinatura || mockProduct.destaque || false,
    alcoholicContent: mockProduct.teorAlcoolico || null,
    volume: mockProduct.volume || null,
    spiceLevel: mockProduct.nivelPicancia || null
  }));

  // Dividir em batches
  const batches = [];
  for (let i = 0; i < productsToSeed.length; i += BATCH_SIZE) {
    batches.push(productsToSeed.slice(i, i + BATCH_SIZE));
  }

  console.log(`📊 Total de ${productsToSeed.length} produtos divididos em ${batches.length} lotes\n`);

  let totalCreated = 0;
  let totalExisting = 0;
  let totalErrors = 0;

  // Processar cada batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNum = i + 1;

    console.log(`\n📦 Processando lote ${batchNum}/${batches.length} (${batch.length} produtos)...`);

    try {
      const response = await axios.post(
        `${API_URL}/api/seed-products-bulk`,
        {
          products: batch,
          secretKey: SEED_KEY
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-seed-key': SEED_KEY
          },
          timeout: 30000 // 30 segundos por batch
        }
      );

      if (response.data.success) {
        const { created, existing, errors, results } = response.data.data;
        totalCreated += created;
        totalExisting += existing;
        totalErrors += errors;

        console.log(`   ✅ Criados: ${created} | ⏭️ Já existiam: ${existing} | ❌ Erros: ${errors}`);

        // Mostrar primeiro erro se houver
        if (errors > 0 && results) {
          const firstError = results.find(r => !r.success);
          if (firstError) {
            console.log(`   🔍 Exemplo de erro: "${firstError.name}" - ${firstError.error}`);
          }
        }
      }

      // Delay entre batches para não sobrecarregar
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      console.error(`   ❌ Erro no lote ${batchNum}:`, error.response?.data?.message || error.message);
      totalErrors += batch.length;
    }
  }

  // Resultado final
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 RESULTADO FINAL DA MIGRAÇÃO:`);
  console.log(`${'='.repeat(60)}`);
  console.log(`   ✅ Total criados: ${totalCreated}`);
  console.log(`   ⏭️  Total já existiam: ${totalExisting}`);
  console.log(`   ❌ Total erros: ${totalErrors}`);
  console.log(`   📦 Total processado: ${productsToSeed.length}`);
  console.log(`${'='.repeat(60)}\n`);

  if (totalCreated > 0) {
    console.log(`🎉 Migração concluída com sucesso!`);
    console.log(`🔗 Verifique: ${API_URL}/api/products\n`);
  }
}

// Executar
migrateInBatches().catch(error => {
  console.error('\n❌ Erro fatal:', error.message);
  process.exit(1);
});
