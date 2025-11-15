import { useEffect, useState } from 'react';
import { mockProducts } from '../data/mockData';

export default function LimparCache() {
  const [status, setStatus] = useState('Iniciando limpeza...');
  const [etapas, setEtapas] = useState([]);

  const addEtapa = (msg) => {
    setEtapas(prev => [...prev, `✅ ${msg}`]);
  };

  useEffect(() => {
    const limparTudo = async () => {
      try {
        // 1. Desregistrar Service Workers
        addEtapa('Desregistrando Service Workers...');
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            addEtapa(`Service Worker desregistrado: ${registration.scope}`);
          }
        }

        // 2. Limpar todos os caches
        addEtapa('Limpando caches...');
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            addEtapa(`Cache deletado: ${cacheName}`);
          }
        }

        // 3. Limpar localStorage
        addEtapa('Limpando localStorage...');
        localStorage.clear();
        
        // 4. Limpar sessionStorage
        addEtapa('Limpando sessionStorage...');
        sessionStorage.clear();

        addEtapa(`Total de produtos no mockData: ${mockProducts.length}`);
        
        setStatus('✅ LIMPEZA COMPLETA!');
        
        setTimeout(() => {
          setStatus('🔄 Redirecionando para /cardapio em 3 segundos...');
          setTimeout(() => {
            window.location.href = '/cardapio';
          }, 3000);
        }, 2000);

      } catch (error) {
        setStatus(`❌ Erro: ${error.message}`);
        addEtapa(`Erro: ${error.message}`);
      }
    };

    limparTudo();
  }, []);

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(0,0,0,0.7)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(255,255,255,0.5)'
        }}>
          🧹 LIMPEZA DE CACHE
        </h1>

        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '2px solid #00ff00'
        }}>
          <h2 style={{ fontSize: '24px', color: '#00ff00', marginBottom: '10px' }}>
            {status}
          </h2>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <h3 style={{ color: '#ffff00', marginBottom: '15px' }}>Log de Atividades:</h3>
          {etapas.map((etapa, index) => (
            <div key={index} style={{
              padding: '8px 0',
              borderBottom: index < etapas.length - 1 ? '1px solid #333' : 'none',
              color: '#00ff00'
            }}>
              {etapa}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,0,0,0.2)',
          borderRadius: '10px',
          border: '2px solid #ff0000'
        }}>
          <h3 style={{ color: '#ff0000', fontSize: '18px', marginBottom: '10px' }}>
            ⚠️ IMPORTANTE:
          </h3>
          <ul style={{ color: '#fff', lineHeight: '1.8' }}>
            <li>Todos os Service Workers foram desregistrados</li>
            <li>Todos os caches foram limpos</li>
            <li>localStorage e sessionStorage limpos</li>
            <li>Você será redirecionado automaticamente</li>
          </ul>
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <a 
            href="/cardapio" 
            style={{
              display: 'inline-block',
              padding: '15px 40px',
              background: '#00ff00',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ➡️ IR PARA CARDÁPIO AGORA
          </a>
        </div>
      </div>
    </div>
  );
}
