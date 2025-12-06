/**
 * Script para migrar produtos do mockData.js para o banco de dados
 * Execução: node scripts/seed-products-from-mock.js
 */

const axios = require('axios');

// URL da API (ajustar conforme ambiente)
const API_URL = process.env.API_URL || 'https://backend-production-28c3.up.railway.app';
const SEED_KEY = 'FLAME2024SEED';

// Mapeamento de categorias mock → banco
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
  'Narguilés': 'bebidas_alcoolicas',
  'Combos': 'combos'
};

// Lista resumida dos produtos mais importantes (20 produtos principais)
// IMPORTANTE: Copiar os 134 produtos completos do frontend/src/data/mockData.js
const mockProducts = [
  {
    nome: 'Caipirinha de Cachaça Artesanal',
    descricao: 'Cachaça premium envelhecida, limão tahiti fresco espremido e açúcar orgânico',
    preco: 32.00,
    categoria: 'Drinks Clássicos',
    imagem: '/images/cardapio/Caipirinha de Cachaça Artesanal.png',
    disponivel: true,
    destaque: true,
    estoque: 50,
    ingredientes: 'Cachaça premium, Limão tahiti, Açúcar orgânico',
    tags: ['tradicional', 'cachaça', 'limão', 'brasileiro']
  },
  {
    nome: 'Gin Tônica Premium',
    descricao: 'Gin Tanqueray Ten, tônica Fever-Tree premium, zimbro fresco e casca de limão siciliano',
    preco: 42.00,
    categoria: 'Drinks Clássicos',
    imagem: '/images/cardapio/Gin Tônica Premium.png',
    disponivel: true,
    destaque: true,
    estoque: 50,
    ingredientes: 'Gin Tanqueray Ten, Tônica Fever-Tree, Zimbro, Limão siciliano',
    tags: ['gin', 'tônica', 'botânicos', 'refrescante']
  },
  // TODO: Adicionar os outros 132 produtos aqui
];

async function seedProducts() {
  console.log('🌱 Iniciando seed de produtos...\n');

  let created = 0;
  let errors = 0;

  for (let i = 0; i < mockProducts.length; i++) {
    const mockProduct = mockProducts[i];

    try {
      const productData = {
        name: mockProduct.nome,
        description: mockProduct.descricao || '',
        price: parseFloat(mockProduct.preco),
        category: categoryMap[mockProduct.categoria] || 'bebidas_alcoolicas',
        subcategory: mockProduct.categoria,
        image: mockProduct.imagem || null,
        ingredients: mockProduct.ingredientes || '',
        tags: mockProduct.tags || [],
        allergens: mockProduct.alergenos ? [mockProduct.alergenos] : [],
        dietary: mockProduct.dietetico ? [mockProduct.dietetico] : [],
        preparationTime: mockProduct.tempoPreparo || 15,
        calories: mockProduct.calorias || null,
        isActive: mockProduct.disponivel !== false,
        isFeatured: mockProduct.destaque || false,
        hasStock: mockProduct.estoque !== undefined,
        stock: mockProduct.estoque || 0,
        minStock: 5,
        position: i + 1,
        isSignature: mockProduct.destaque || false,
        alcoholicContent: mockProduct.teorAlcoolico || null,
        volume: mockProduct.volume || null,
        spiceLevel: mockProduct.nivelPicancia || null
      };

      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-seed-key': SEED_KEY
          }
        }
      );

      if (response.data.success) {
        created++;
        console.log(`✅ [${i + 1}/${mockProducts.length}] ${mockProduct.nome}`);
      }
    } catch (error) {
      errors++;
      console.error(`❌ [${i + 1}/${mockProducts.length}] ${mockProduct.nome}:`, error.response?.data?.message || error.message);
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Criados: ${created}`);
  console.log(`   ❌ Erros: ${errors}`);
  console.log(`   📦 Total: ${mockProducts.length}`);
}

// Executar
seedProducts().catch(console.error);
