import { mockProducts, mockCategories } from '../../data/mockData';

export default function handler(req, res) {
  // Impedir qualquer tipo de cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  const stats = {
    timestamp: new Date().toISOString(),
    totalProdutos: mockProducts.length,
    totalCategorias: mockCategories.length,
    primeiroID: mockProducts[0]?.id,
    ultimoID: mockProducts[mockProducts.length - 1]?.id,
    produtosPorCategoria: {},
    primeiros5: mockProducts.slice(0, 5).map(p => ({ id: p.id, nome: p.nome })),
    ultimos5: mockProducts.slice(-5).map(p => ({ id: p.id, nome: p.nome })),
    todosOsIDs: mockProducts.map(p => p.id),
    status: mockProducts.length === 62 ? '✅ CORRETO' : '❌ INCORRETO',
    mensagem: mockProducts.length === 62 
      ? 'mockData.js está carregando corretamente com 62 produtos!'
      : `ERRO: Esperado 62 produtos, encontrado ${mockProducts.length}`
  };

  mockCategories.forEach(cat => {
    stats.produtosPorCategoria[cat] = mockProducts.filter(p => p.categoria === cat).length;
  });

  res.status(200).json(stats);
}
