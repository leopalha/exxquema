import { useCallback } from 'react';

/**
 * Hook for playing notification sounds using Web Audio API
 * Provides multiple sound patterns for different notifications
 */
export const useNotificationSound = () => {
  /**
   * Play a simple beep sound
   * @param {number} frequency - Frequency in Hz (default: 600)
   * @param {number} duration - Duration in milliseconds (default: 300)
   * @param {number} volume - Volume 0-1 (default: 0.3)
   */
  const playBeep = useCallback((frequency = 600, duration = 300, volume = 0.3) => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (error) {
        console.warn('Erro ao reproduzir som:', error);
      }
    }
  }, []);

  /**
   * Play alert sound (double beep)
   */
  const playAlert = useCallback(() => {
    playBeep(800, 200, 0.35);
    setTimeout(() => playBeep(800, 200, 0.35), 250);
  }, [playBeep]);

  /**
   * Play success sound (ascending tones)
   */
  const playSuccess = useCallback(() => {
    playBeep(400, 150, 0.3);
    setTimeout(() => playBeep(600, 150, 0.3), 180);
    setTimeout(() => playBeep(800, 150, 0.3), 360);
  }, [playBeep]);

  /**
   * Play error sound (descending tone)
   */
  const playError = useCallback(() => {
    playBeep(800, 200, 0.35);
    setTimeout(() => playBeep(600, 200, 0.35), 250);
  }, [playBeep]);

  /**
   * Play notification sound for new order
   */
  const playNewOrder = useCallback(() => {
    playBeep(600, 100, 0.3);
    setTimeout(() => playBeep(800, 100, 0.3), 130);
    setTimeout(() => playBeep(600, 150, 0.3), 260);
  }, [playBeep]);

  /**
   * Play urgent sound for delayed orders
   */
  const playUrgent = useCallback(() => {
    playBeep(900, 150, 0.4);
    setTimeout(() => playBeep(900, 150, 0.4), 200);
    setTimeout(() => playBeep(900, 200, 0.4), 400);
  }, [playBeep]);

  return {
    playBeep,
    playAlert,
    playSuccess,
    playError,
    playNewOrder,
    playUrgent
  };
};

export default useNotificationSound;
