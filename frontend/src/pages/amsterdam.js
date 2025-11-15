import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

// Logo Amsterdam Buildings - Casas do século XVII
const AmsterdamBuildingsLogo = ({ color = "#E30613", size = 200, variant = "classic" }) => {

  if (variant === "minimal") {
    return (
      <svg width={size} height={size} viewBox="0 0 300 200" fill="none">
        {/* Versão minimalista - 3 prédios simples */}

        {/* Glow background */}
        <rect x="0" y="0" width="300" height="200" fill={color} opacity="0.03"/>

        {/* Prédio 1 - Esquerda */}
        <rect x="40" y="80" width="60" height="100" fill={color} opacity="0.8"/>
        <path d="M 40 80 L 70 50 L 100 80 Z" fill={color}/>
        <rect x="55" y="100" width="12" height="16" fill="black" opacity="0.3"/>
        <rect x="73" y="100" width="12" height="16" fill="black" opacity="0.3"/>

        {/* Prédio 2 - Centro */}
        <rect x="110" y="60" width="70" height="120" fill={color}/>
        <path d="M 110 60 L 145 35 L 180 60 Z" fill={color} opacity="0.9"/>
        <rect x="125" y="80" width="14" height="18" fill="black" opacity="0.3"/>
        <rect x="151" y="80" width="14" height="18" fill="black" opacity="0.3"/>

        {/* Prédio 3 - Direita */}
        <rect x="190" y="85" width="65" height="95" fill={color} opacity="0.8"/>
        <path d="M 190 85 L 222 55 L 255 85 Z" fill={color}/>
        <rect x="205" y="105" width="13" height="17" fill="black" opacity="0.3"/>
        <rect x="227" y="105" width="13" height="17" fill="black" opacity="0.3"/>

        {/* Canal (água) */}
        <ellipse cx="150" cy="185" rx="130" ry="8" fill="#1C3A3A" opacity="0.4"/>
      </svg>
    );
  }

  if (variant === "silhouette") {
    return (
      <svg width={size} height={size} viewBox="0 0 300 200" fill="none">
        {/* Versão silhueta - estilo skyline */}

        {/* Céu com glow */}
        <rect x="0" y="0" width="300" height="140" fill="url(#skyGradient)"/>
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Silhuetas dos prédios */}
        <g fill={color}>
          {/* Prédio 1 */}
          <path d="M 30 140 L 30 75 L 50 55 L 70 65 L 70 75 L 90 75 L 90 140 Z"/>

          {/* Prédio 2 */}
          <path d="M 95 140 L 95 60 L 115 40 L 135 50 L 135 35 L 155 35 L 155 60 L 175 60 L 175 140 Z"/>

          {/* Prédio 3 */}
          <path d="M 180 140 L 180 80 L 200 65 L 220 75 L 220 140 Z"/>

          {/* Prédio 4 */}
          <path d="M 225 140 L 225 70 L 245 50 L 265 60 L 265 85 L 270 85 L 270 140 Z"/>
        </g>

        {/* Canal com reflexo */}
        <ellipse cx="150" cy="150" rx="140" ry="12" fill="#1C3A3A" opacity="0.5"/>
        <ellipse cx="150" cy="150" rx="100" ry="6" fill="#1C3A3A" opacity="0.3"/>
      </svg>
    );
  }

  // Variant "classic" - versão detalhada completa
  return (
    <svg width={size} height={size} viewBox="0 0 320 220" fill="none">
      {/* Versão CLASSIC - Amsterdam Canal Houses detalhadas */}

      {/* Background - céu e glow */}
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C3A3A" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>

        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C3A3A" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#1C3A3A" stopOpacity="0.6"/>
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="160" fill="url(#skyGrad)"/>

      {/* ========== PRÉDIO 1 - Esquerda (Estilo Gable clássico) ========== */}
      <g>
        {/* Corpo do prédio */}
        <rect x="20" y="90" width="65" height="110" fill={color}/>

        {/* Telhado em degraus (típico Amsterdam) */}
        <path
          d="M 20 90 L 25 85 L 25 75 L 30 70 L 30 60 L 35 55 L 52.5 40 L 70 55 L 70 60 L 75 60 L 75 70 L 80 70 L 80 85 L 85 90 Z"
          fill={color}
          opacity="0.9"
        />

        {/* Detalhes do telhado */}
        <rect x="48" y="35" width="9" height="8" fill="#D4AF37"/>

        {/* Janelas - 3 andares */}
        {/* Andar 1 */}
        <rect x="30" y="100" width="13" height="18" fill="#0A0A0A" opacity="0.4"/>
        <rect x="52" y="100" width="13" height="18" fill="#0A0A0A" opacity="0.4"/>
        <line x1="30" y1="109" x2="43" y2="109" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="36.5" y1="100" x2="36.5" y2="118" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="52" y1="109" x2="65" y2="109" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="58.5" y1="100" x2="58.5" y2="118" stroke="#D4AF37" strokeWidth="1"/>

        {/* Andar 2 */}
        <rect x="30" y="130" width="13" height="18" fill="#0A0A0A" opacity="0.4"/>
        <rect x="52" y="130" width="13" height="18" fill="#0A0A0A" opacity="0.4"/>
        <line x1="30" y1="139" x2="43" y2="139" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="36.5" y1="130" x2="36.5" y2="148" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="52" y1="139" x2="65" y2="139" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="58.5" y1="130" x2="58.5" y2="148" stroke="#D4AF37" strokeWidth="1"/>

        {/* Porta */}
        <rect x="35" y="170" width="20" height="30" rx="2" fill="#0A0A0A" opacity="0.5"/>
        <circle cx="50" cy="185" r="1.5" fill="#D4AF37"/>
      </g>

      {/* ========== PRÉDIO 2 - Centro-Esquerda (Mais alto) ========== */}
      <g>
        {/* Corpo */}
        <rect x="95" y="55" width="70" height="145" fill={color} opacity="0.95"/>

        {/* Telhado bell gable */}
        <path
          d="M 95 55 L 100 50 L 100 40 L 105 35 L 105 25 L 130 10 L 155 25 L 155 35 L 160 35 L 160 45 L 165 50 L 165 55 Z"
          fill={color}
        />

        {/* Ornamento topo */}
        <circle cx="130" cy="8" r="4" fill="#D4AF37"/>
        <rect x="127" y="12" width="6" height="15" fill="#D4AF37"/>

        {/* Janelas - 4 andares */}
        {/* Andar 1 */}
        <rect x="105" y="65" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <rect x="135" y="65" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <line x1="105" y1="75" x2="120" y2="75" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="112.5" y1="65" x2="112.5" y2="85" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="135" y1="75" x2="150" y2="75" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="142.5" y1="65" x2="142.5" y2="85" stroke="#D4AF37" strokeWidth="1"/>

        {/* Andar 2 */}
        <rect x="105" y="95" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <rect x="135" y="95" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <line x1="105" y1="105" x2="120" y2="105" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="112.5" y1="95" x2="112.5" y2="115" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="135" y1="105" x2="150" y2="105" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="142.5" y1="95" x2="142.5" y2="115" stroke="#D4AF37" strokeWidth="1"/>

        {/* Andar 3 */}
        <rect x="105" y="125" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <rect x="135" y="125" width="15" height="20" fill="#0A0A0A" opacity="0.4"/>
        <line x1="105" y1="135" x2="120" y2="135" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="112.5" y1="125" x2="112.5" y2="145" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="135" y1="135" x2="150" y2="135" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="142.5" y1="125" x2="142.5" y2="145" stroke="#D4AF37" strokeWidth="1"/>

        {/* Porta com arco */}
        <path d="M 115 170 L 115 200 L 145 200 L 145 170 Q 130 160 115 170 Z" fill="#0A0A0A" opacity="0.5"/>
        <circle cx="140" cy="185" r="2" fill="#D4AF37"/>
      </g>

      {/* ========== PRÉDIO 3 - Centro-Direita (Médio) ========== */}
      <g>
        {/* Corpo */}
        <rect x="175" y="75" width="60" height="125" fill={color} opacity="0.9"/>

        {/* Telhado neck gable */}
        <path
          d="M 175 75 L 180 70 L 180 55 L 185 50 L 185 35 L 205 20 L 225 35 L 225 50 L 230 55 L 230 70 L 235 75 Z"
          fill={color}
        />

        {/* Detalhes topo */}
        <rect x="200" y="15" width="10" height="8" fill="#D4AF37"/>
        <circle cx="205" cy="12" r="3" fill="#D4AF37"/>

        {/* Janelas - 3 andares */}
        {/* Andar 1 */}
        <rect x="185" y="85" width="14" height="19" fill="#0A0A0A" opacity="0.4"/>
        <rect x="211" y="85" width="14" height="19" fill="#0A0A0A" opacity="0.4"/>
        <line x1="185" y1="94.5" x2="199" y2="94.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="192" y1="85" x2="192" y2="104" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="211" y1="94.5" x2="225" y2="94.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="218" y1="85" x2="218" y2="104" stroke="#D4AF37" strokeWidth="1"/>

        {/* Andar 2 */}
        <rect x="185" y="115" width="14" height="19" fill="#0A0A0A" opacity="0.4"/>
        <rect x="211" y="115" width="14" height="19" fill="#0A0A0A" opacity="0.4"/>
        <line x1="185" y1="124.5" x2="199" y2="124.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="192" y1="115" x2="192" y2="134" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="211" y1="124.5" x2="225" y2="124.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="218" y1="115" x2="218" y2="134" stroke="#D4AF37" strokeWidth="1"/>

        {/* Porta */}
        <rect x="192" y="165" width="18" height="35" rx="2" fill="#0A0A0A" opacity="0.5"/>
        <circle cx="205" cy="182" r="1.5" fill="#D4AF37"/>
      </g>

      {/* ========== PRÉDIO 4 - Direita (Baixo) ========== */}
      <g>
        {/* Corpo */}
        <rect x="245" y="95" width="55" height="105" fill={color} opacity="0.85"/>

        {/* Telhado simples */}
        <path
          d="M 245 95 L 250 90 L 250 75 L 255 70 L 272.5 55 L 290 70 L 290 80 L 295 85 L 300 95 Z"
          fill={color}
        />

        {/* Janelas - 2 andares */}
        <rect x="255" y="110" width="13" height="17" fill="#0A0A0A" opacity="0.4"/>
        <rect x="277" y="110" width="13" height="17" fill="#0A0A0A" opacity="0.4"/>
        <line x1="255" y1="118.5" x2="268" y2="118.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="261.5" y1="110" x2="261.5" y2="127" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="277" y1="118.5" x2="290" y2="118.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="283.5" y1="110" x2="283.5" y2="127" stroke="#D4AF37" strokeWidth="1"/>

        <rect x="255" y="140" width="13" height="17" fill="#0A0A0A" opacity="0.4"/>
        <rect x="277" y="140" width="13" height="17" fill="#0A0A0A" opacity="0.4"/>
        <line x1="255" y1="148.5" x2="268" y2="148.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="261.5" y1="140" x2="261.5" y2="157" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="277" y1="148.5" x2="290" y2="148.5" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="283.5" y1="140" x2="283.5" y2="157" stroke="#D4AF37" strokeWidth="1"/>

        {/* Porta */}
        <rect x="262" y="170" width="16" height="30" rx="1" fill="#0A0A0A" opacity="0.5"/>
      </g>

      {/* ========== CANAL (água) ========== */}
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="url(#waterGrad)"/>
      <ellipse cx="160" cy="205" rx="120" ry="6" fill="#1C3A3A" opacity="0.3"/>

      {/* Reflexos no canal */}
      <path d="M 40 207 L 40 215" stroke={color} strokeWidth="2" opacity="0.15"/>
      <path d="M 130 207 L 130 217" stroke={color} strokeWidth="2.5" opacity="0.2"/>
      <path d="M 205 207 L 205 215" stroke={color} strokeWidth="2" opacity="0.15"/>
      <path d="M 272 207 L 272 214" stroke={color} strokeWidth="1.5" opacity="0.12"/>
    </svg>
  );
};

export default function AmsterdamPage() {
  const [selectedVariant, setSelectedVariant] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('#E30613');
  const [bgColor, setBgColor] = useState('black');

  const variants = [
    {
      id: 'classic',
      name: 'Detalhado',
      description: '4 casas do século XVII com todos os detalhes arquitetônicos'
    },
    {
      id: 'silhouette',
      name: 'Silhueta',
      description: 'Skyline minimalista estilo Amsterdam'
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      description: '3 prédios simples e clean'
    }
  ];

  const colors = [
    { id: 'red', name: 'Vermelho Red Light', value: '#E30613' },
    { id: 'gold', name: 'Dourado Holandês', value: '#D4AF37' },
    { id: 'white', name: 'Branco', value: '#FFFFFF' },
    { id: 'canal', name: 'Canal Water', value: '#1C3A3A' },
    { id: 'brick', name: 'Brick Red', value: '#8B3A3A' }
  ];

  const backgrounds = [
    { id: 'black', name: 'Preto', value: 'black' },
    { id: 'white', name: 'Branco', value: 'white' },
    { id: 'canal', name: 'Canal Water', value: '#1C3A3A' },
    { id: 'gradient', name: 'Pôr do Sol', value: 'linear-gradient(180deg, #1C3A3A 0%, #D4AF37 50%, #E30613 100%)' }
  ];

  return (
    <>
      <Head>
        <title>Amsterdam Buildings Logo | Red Light</title>
        <meta name="description" content="Logo inspirado nas casas de canal de Amsterdam século XVII" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-[#E30613]/20 border border-[#E30613] px-6 py-2 rounded-full mb-6">
                <span className="text-[#E30613] font-semibold">ARQUITETURA HISTÓRICA</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Casas de Amsterdam
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                As icônicas casas estreitas do século XVII que margeiam os canais de Amsterdam.
                Telhados em degraus (gables), janelas altas e a arquitetura da Era de Ouro holandesa.
              </p>
            </motion.div>

            {/* Main Display */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Logo Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  className="aspect-[3/2] rounded-2xl border-2 border-[#262626] flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: bgColor.includes('gradient') ? bgColor : bgColor,
                  }}
                >
                  <motion.div
                    key={selectedVariant + selectedColor}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AmsterdamBuildingsLogo
                      color={selectedColor}
                      size={500}
                      variant={selectedVariant}
                    />
                  </motion.div>
                </div>

                {/* Info Cards */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#E30613] mb-1">1385</div>
                    <div className="text-xs text-gray-400">Fundação</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37] mb-1">XVII</div>
                    <div className="text-xs text-gray-400">Século</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">165</div>
                    <div className="text-xs text-gray-400">Canais</div>
                  </div>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Variant Selection */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Escolha o Estilo</h3>
                  <div className="space-y-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedVariant === variant.id
                            ? 'border-[#E30613] bg-[#E30613]/10'
                            : 'border-[#262626] bg-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <div className="font-semibold text-white mb-1">{variant.name}</div>
                        <div className="text-sm text-gray-400">{variant.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Escolha a Cor</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.value)}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          selectedColor === color.value
                            ? 'border-[#E30613] bg-[#E30613]/10'
                            : 'border-[#262626] bg-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded border-2 border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-xs text-white font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Selection */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Fundo</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setBgColor(bg.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          bgColor === bg.value
                            ? 'border-[#E30613] bg-[#E30613]/10'
                            : 'border-[#262626] bg-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <div
                          className="w-full h-10 rounded mb-2 border border-white/10"
                          style={{ background: bg.value }}
                        />
                        <span className="text-xs text-white font-medium">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Architecture Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#1C3A3A] via-black to-[#8B3A3A] border border-[#E30613]/30 rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Elementos Arquitetônicos
              </h2>

              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-lg font-bold text-[#D4AF37] mb-3">Gables</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Telhados em degraus característicos do século XVII.
                    Cada tipo (bell, neck, step) tinha significado específico.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">🪟</div>
                  <h3 className="text-lg font-bold text-[#D4AF37] mb-3">Janelas Altas</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Grandes janelas para aproveitar luz natural.
                    Molduras douradas representavam riqueza mercantil.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-bold text-[#D4AF37] mb-3">Fachadas Estreitas</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Impostos baseados na largura da fachada levaram
                    a casas estreitas e profundas.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">💧</div>
                  <h3 className="text-lg font-bold text-[#D4AF37] mb-3">Canal Houses</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Construídas sobre estacas de madeira (20.000+ por prédio)
                    devido ao solo pantanoso.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  <span className="text-[#D4AF37] font-semibold">Durante a Era de Ouro Holandesa (século XVII)</span>,
                  Amsterdam se tornou o centro comercial do mundo. Estas casas foram construídas por
                  mercadores ricos que exibiam sua prosperidade através da arquitetura elaborada.
                  Hoje, são patrimônio mundial da UNESCO e símbolo eterno da cidade.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
