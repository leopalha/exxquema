import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      console.log('🖼️ Modal aberto:', title);
      document.body.style.overflow = 'hidden';

      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose, title]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - fundo preto */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 999998,
          cursor: 'pointer'
        }}
      />

      {/* Container do Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '1200px',
          height: '80vh',
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          border: '3px solid #f97316',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '2px solid #f97316',
            backgroundColor: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          {title && (
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ea580c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f97316'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'auto',
            backgroundColor: '#111827'
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '2px solid #f97316',
            backgroundColor: '#111827',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Clique fora da imagem ou pressione ESC para fechar
          </p>
        </div>
      </div>
    </>
  );
}
