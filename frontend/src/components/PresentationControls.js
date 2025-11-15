import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Presentation,
  Maximize,
  Minimize
} from 'lucide-react';

const PresentationControls = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  textSize,
  onTextSizeChange,
  isFullscreen,
  onToggleFullscreen,
  isPresentationMode,
  onTogglePresentationMode
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mouseTimeout, setMouseTimeout] = useState(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);

      if (mouseTimeout) clearTimeout(mouseTimeout);

      const timeout = setTimeout(() => {
        if (isPresentationMode) {
          setIsVisible(false);
        }
      }, 3000);

      setMouseTimeout(timeout);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'f' || e.key === 'F') onToggleFullscreen();
      if (e.key === 'p' || e.key === 'P') onTogglePresentationMode();
      if (e.key === '+' || e.key === '=') {
        if (textSize < 2) onTextSizeChange(textSize + 1);
      }
      if (e.key === '-' || e.key === '_') {
        if (textSize > 0) onTextSizeChange(textSize - 1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, [isPresentationMode, mouseTimeout, textSize]);

  // Se está em modo apresentação e controles não estão visíveis, não renderiza nada
  if (isPresentationMode && !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Navegação */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevious}
                  disabled={currentSlide === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Slide Anterior (←)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="px-4 py-2 bg-gray-800 rounded-lg text-white font-medium min-w-[120px] text-center">
                  <span className="text-red-400">{currentSlide}</span>
                  <span className="text-gray-400"> / {totalSlides}</span>
                </div>

                <button
                  onClick={onNext}
                  disabled={currentSlide === totalSlides}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Próximo Slide (→)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de progresso */}
              <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Controles de visualização */}
              <div className="flex items-center gap-2">
                {/* Tamanho do texto */}
                <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => textSize > 0 && onTextSizeChange(textSize - 1)}
                    disabled={textSize === 0}
                    className="p-2 rounded hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Diminuir Texto (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1 text-xs text-gray-400 font-medium min-w-[60px] text-center">
                    {textSize === 0 ? 'Pequeno' : textSize === 1 ? 'Médio' : 'Grande'}
                  </div>

                  <button
                    onClick={() => textSize < 2 && onTextSizeChange(textSize + 1)}
                    disabled={textSize === 2}
                    className="p-2 rounded hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Aumentar Texto (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Tela Cheia */}
                <button
                  onClick={onToggleFullscreen}
                  className={`p-2 rounded-lg transition-colors ${
                    isFullscreen
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  title="Tela Cheia (F)"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>

                {/* Modo Apresentação */}
                <button
                  onClick={onTogglePresentationMode}
                  className={`p-2 rounded-lg transition-colors ${
                    isPresentationMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  title="Modo Apresentação (P)"
                >
                  <Presentation className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PresentationControls;
