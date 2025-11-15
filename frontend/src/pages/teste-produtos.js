import { mockProducts, mockCategories } from '../data/mockData';

export default function TesteProdutos() {
  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff0000', fontSize: '48px', marginBottom: '20px' }}>
        🔍 TESTE DE MOCKDATA
      </h1>
      
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00', fontSize: '32px' }}>
          ✅ Total de produtos: {mockProducts.length}
        </h2>
        <h3 style={{ color: '#00ff00', fontSize: '24px' }}>
          ✅ Total de categorias: {mockCategories.length}
        </h3>
      </div>

      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>Produtos por Categoria:</h3>
        {mockCategories.map(cat => {
          const count = mockProducts.filter(p => p.categoria === cat).length;
          return (
            <div key={cat} style={{ padding: '5px 0', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#00ffff' }}>{cat}:</span> {count} produtos
            </div>
          );
        })}
      </div>

      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>Lista de Todos os Produtos:</h3>
        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
          {mockProducts.map(produto => (
            <div key={produto.id} style={{ 
              padding: '10px', 
              borderBottom: '1px solid #333',
              display: 'flex',
              gap: '20px'
            }}>
              <span style={{ color: '#ff00ff', minWidth: '50px' }}>ID {produto.id}</span>
              <span style={{ color: '#00ffff', flex: 1 }}>{produto.nome}</span>
              <span style={{ color: '#ffff00' }}>{produto.categoria}</span>
              <span style={{ color: '#00ff00' }}>R$ {produto.preco.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#ff0000', borderRadius: '8px' }}>
        <h2 style={{ color: '#fff', fontSize: '24px' }}>
          {mockProducts.length === 62 
            ? '✅ SUCESSO! Todos os 62 produtos estão sendo carregados!'
            : `❌ ERRO! Esperado 62, encontrado ${mockProducts.length}`
          }
        </h2>
      </div>
    </div>
  );
}
