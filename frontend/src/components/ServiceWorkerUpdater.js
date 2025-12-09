import { useEffect, useState } from 'react';
import styles from './ServiceWorkerUpdater.module.css';

export default function ServiceWorkerUpdater() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Verificar atualizações a cada 30 segundos
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.update();
        }
      });
    }, 30000);

    // Listener para detectar nova versão
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[App] Nova versão do SW detectada');
      // Recarregar a página automaticamente
      window.location.reload();
    });

    // Verificar se há update pendente
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.waiting) {
        setShowUpdate(true);
        setRegistration(reg);
      }

      // Listener para novo SW instalado
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[App] Nova versão disponível');
            setShowUpdate(true);
            setRegistration(reg);
          }
        });
      });
    });

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) {
      window.location.reload();
      return;
    }

    // Enviar mensagem para o SW ativar imediatamente
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Recarregar após 500ms
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className={styles.updateBanner}>
      <div className={styles.content}>
        <div className={styles.icon}>🔄</div>
        <div className={styles.text}>
          <strong>Nova versão disponível!</strong>
          <p>Atualize para obter as últimas melhorias</p>
        </div>
        <button onClick={handleUpdate} className={styles.button}>
          Atualizar Agora
        </button>
      </div>
    </div>
  );
}
