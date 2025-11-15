import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

// Logo Lampião - Estilo lanterna antiga de Amsterdam
const LampiaoLogo = ({ color = "#E30613", size = 200, variant = "full" }) => {
  if (variant === "minimal") {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        {/* Versão minimalista - apenas a chama */}

        {/* Glow externo */}
        <circle cx="100" cy="80" r="60" fill={color} opacity="0.05"/>
        <circle cx="100" cy="80" r="45" fill={color} opacity="0.1"/>

        {/* Vidro/cúpula */}
        <ellipse cx="100" cy="90" rx="30" ry="40" stroke={color} strokeWidth="2" fill="none" opacity="0.3"/>

        {/* Chama */}
        <path
          d="M 100 60 Q 90 70 95 85 Q 98 95 100 100 Q 102 95 105 85 Q 110 70 100 60 Z"
          fill={color}
        />

        {/* Centro da chama (branco) */}
        <path
          d="M 100 70 Q 95 75 97 85 Q 99 90 100 92 Q 101 90 103 85 Q 105 75 100 70 Z"
          fill="#FFFFFF"
          opacity="0.6"
        />

        {/* Base simples */}
        <rect x="85" y="120" width="30" height="8" rx="2" fill={color}/>
      </svg>
    );
  }

  if (variant === "classic") {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        {/* Versão clássica - lampião completo */}

        {/* Glow background */}
        <circle cx="100" cy="90" r="70" fill={color} opacity="0.08"/>
        <circle cx="100" cy="90" r="55" fill={color} opacity="0.12"/>

        {/* Topo do lampião */}
        <path
          d="M 100 30 L 90 40 L 90 50 L 110 50 L 110 40 Z"
          fill={color}
          opacity="0.8"
        />

        {/* Gancho */}
        <path
          d="M 100 20 L 100 30"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Estrutura de vidro - formato clássico */}
        <path
          d="M 70 50 Q 65 70 65 90 Q 65 110 70 120 L 130 120 Q 135 110 135 90 Q 135 70 130 50 Z"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Divisórias verticais do vidro */}
        <line x1="80" y1="50" x2="75" y2="120" stroke={color} strokeWidth="1" opacity="0.3"/>
        <line x1="100" y1="50" x2="100" y2="120" stroke={color} strokeWidth="1" opacity="0.4"/>
        <line x1="120" y1="50" x2="125" y2="120" stroke={color} strokeWidth="1" opacity="0.3"/>

        {/* Chama principal */}
        <path
          d="M 100 65 Q 88 75 92 92 Q 96 105 100 110 Q 104 105 108 92 Q 112 75 100 65 Z"
          fill={color}
        />

        {/* Centro branco da chama */}
        <path
          d="M 100 75 Q 93 82 96 92 Q 98 100 100 103 Q 102 100 104 92 Q 107 82 100 75 Z"
          fill="#FFFFFF"
          opacity="0.7"
        />

        {/* Reflexos do vidro */}
        <path
          d="M 72 60 Q 68 75 68 90"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.2"
        />

        {/* Base do lampião */}
        <rect x="70" y="120" width="60" height="8" fill={color}/>
        <path
          d="M 65 128 L 70 140 L 130 140 L 135 128 Z"
          fill={color}
          opacity="0.9"
        />

        {/* Detalhes decorativos na base */}
        <line x1="75" y1="132" x2="75" y2="138" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="100" y1="132" x2="100" y2="138" stroke="#D4AF37" strokeWidth="1"/>
        <line x1="125" y1="132" x2="125" y2="138" stroke="#D4AF37" strokeWidth="1"/>
      </svg>
    );
  }

  // Variant "full" - versão completa e detalhada
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Versão FULL - Lampião Amsterdam 1385 */}

      {/* Glow background grande */}
      <circle cx="100" cy="95" r="85" fill={color} opacity="0.06"/>
      <circle cx="100" cy="95" r="65" fill={color} opacity="0.1"/>

      {/* Argola/corrente no topo */}
      <ellipse cx="100" cy="18" rx="8" ry="4" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="100" y1="22" x2="100" y2="35" stroke={color} strokeWidth="2.5"/>

      {/* Tampa superior ornamentada */}
      <path
        d="M 100 35 L 85 42 L 83 48 L 117 48 L 115 42 Z"
        fill="#D4AF37"
        stroke="#D4AF37"
        strokeWidth="1"
      />

      {/* Detalhes da tampa */}
      <circle cx="100" cy="42" r="3" fill={color}/>

      {/* Estrutura de metal do lampião */}
      <path
        d="M 83 48 L 78 55 Q 73 65 70 80 Q 68 95 70 110 Q 72 120 75 128 L 125 128 Q 128 120 130 110 Q 132 95 130 80 Q 127 65 122 55 L 117 48 Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />

      {/* Vidro/cristal (mais transparente) */}
      <path
        d="M 83 48 L 78 55 Q 73 65 70 80 Q 68 95 70 110 Q 72 120 75 128 L 125 128 Q 128 120 130 110 Q 132 95 130 80 Q 127 65 122 55 L 117 48 Z"
        fill={color}
        opacity="0.05"
      />

      {/* Divisórias verticais ornamentadas */}
      <path
        d="M 83 48 L 78 55 Q 76 70 75 90 Q 76 110 78 128"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M 100 48 L 100 128"
        stroke={color}
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M 117 48 L 122 55 Q 124 70 125 90 Q 124 110 122 128"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Divisórias horizontais */}
      <path
        d="M 83 48 Q 100 46 117 48"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
      <ellipse cx="100" cy="90" rx="30" ry="5" stroke={color} strokeWidth="1" opacity="0.2"/>

      {/* CHAMA PRINCIPAL - Forma de fogo realista */}
      <path
        d="M 100 60 Q 86 68 88 85 Q 90 98 95 108 Q 98 115 100 118 Q 102 115 105 108 Q 110 98 112 85 Q 114 68 100 60 Z"
        fill={color}
      />

      {/* Chama interna (laranja/amarela) */}
      <path
        d="M 100 68 Q 90 75 92 88 Q 94 98 97 106 Q 99 111 100 113 Q 101 111 103 106 Q 106 98 108 88 Q 110 75 100 68 Z"
        fill="#FF8C00"
        opacity="0.8"
      />

      {/* Centro da chama (branco quente) */}
      <path
        d="M 100 76 Q 94 82 95 92 Q 97 100 100 105 Q 103 100 105 92 Q 106 82 100 76 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Faíscas/sparks */}
      <circle cx="95" cy="70" r="1.5" fill="#FFFFFF" opacity="0.6"/>
      <circle cx="105" cy="72" r="1" fill="#FFFFFF" opacity="0.5"/>
      <circle cx="100" cy="65" r="1" fill="#FFFFFF" opacity="0.7"/>

      {/* Reflexos do vidro */}
      <path
        d="M 75 60 Q 72 75 71 90 Q 72 105 74 120"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.15"
      />
      <path
        d="M 80 55 Q 78 70 78 90"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.1"
      />

      {/* Base ornamentada */}
      <rect x="70" y="128" width="60" height="6" rx="1" fill={color}/>

      {/* Base principal com detalhes */}
      <path
        d="M 65 134 L 68 145 Q 70 150 75 152 L 125 152 Q 130 150 132 145 L 135 134 Z"
        fill={color}
      />

      {/* Detalhes dourados na base */}
      <path
        d="M 65 134 L 68 145 Q 70 150 75 152 L 125 152 Q 130 150 132 145 L 135 134 Z"
        stroke="#D4AF37"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Linhas decorativas verticais na base */}
      <line x1="75" y1="134" x2="77" y2="150" stroke="#D4AF37" strokeWidth="1"/>
      <line x1="90" y1="134" x2="91" y2="151" stroke="#D4AF37" strokeWidth="1"/>
      <line x1="100" y1="134" x2="100" y2="152" stroke="#D4AF37" strokeWidth="1.5"/>
      <line x1="110" y1="134" x2="109" y2="151" stroke="#D4AF37" strokeWidth="1"/>
      <line x1="125" y1="134" x2="123" y2="150" stroke="#D4AF37" strokeWidth="1"/>

      {/* Pés do lampião */}
      <ellipse cx="100" cy="152" rx="28" ry="4" fill={color} opacity="0.8"/>

      {/* Reflexo da luz no chão (glow effect) */}
      <ellipse cx="100" cy="165" rx="40" ry="8" fill={color} opacity="0.15"/>
      <ellipse cx="100" cy="165" rx="25" ry="5" fill={color} opacity="0.25"/>
    </svg>
  );
};

export default function LampiaoPage() {
  const [selectedVariant, setSelectedVariant] = useState('full');
  const [selectedColor, setSelectedColor] = useState('#E30613');
  const [bgColor, setBgColor] = useState('black');

  const variants = [
    { id: 'full', name: 'Completo', description: 'Lampião detalhado Amsterdam 1385' },
    { id: 'classic', name: 'Clássico', description: 'Versão intermediária elegante' },
    { id: 'minimal', name: 'Minimalista', description: 'Apenas a essência da luz' }
  ];

  const colors = [
    { id: 'red', name: 'Vermelho Red Light', value: '#E30613' },
    { id: 'gold', name: 'Dourado Era de Ouro', value: '#D4AF37' },
    { id: 'white', name: 'Branco', value: '#FFFFFF' },
    { id: 'canal', name: 'Canal Water', value: '#1C3A3A' }
  ];

  const backgrounds = [
    { id: 'black', name: 'Preto', value: 'black' },
    { id: 'white', name: 'Branco', value: 'white' },
    { id: 'red', name: 'Vermelho', value: '#E30613' },
    { id: 'gradient', name: 'Gradiente', value: 'linear-gradient(135deg, #0a0a0a 0%, #1C3A3A 100%)' }
  ];

  return (
    <>
      <Head>
        <title>Lampião Logo | Red Light</title>
        <meta name="description" content="Logo lampião Amsterdam 1385 - Red Light Lounge Bar" />
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
                <span className="text-[#E30613] font-semibold">LOGO OFICIAL ALTERNATIVO</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                O Lampião de Amsterdam
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Inspirado nos lampiões originais que iluminavam as ruas de Amsterdam desde 1385.
                Uma lanterna que atravessou 700 anos de história para chegar a Botafogo.
              </p>
            </motion.div>

            {/* Main Display */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Logo Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div
                  className="aspect-square rounded-2xl border-2 border-[#262626] flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: bgColor.includes('gradient') ? bgColor : bgColor,
                  }}
                >
                  {/* Grid background */}
                  {bgColor === 'black' && (
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full" style={{
                        backgroundImage: 'linear-gradient(#E30613 1px, transparent 1px), linear-gradient(90deg, #E30613 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                      }}/>
                    </div>
                  )}

                  <motion.div
                    key={selectedVariant + selectedColor}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    <LampiaoLogo
                      color={selectedColor}
                      size={400}
                      variant={selectedVariant}
                    />
                  </motion.div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {variants.find(v => v.id === selectedVariant)?.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {variants.find(v => v.id === selectedVariant)?.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor }}/>
                    {colors.find(c => c.value === selectedColor)?.name}
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
                  <h3 className="text-lg font-bold text-white mb-4">Escolha a Versão</h3>
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
                        className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          selectedColor === color.value
                            ? 'border-[#E30613] bg-[#E30613]/10'
                            : 'border-[#262626] bg-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm text-white font-medium">{color.name}</span>
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
                        className={`p-4 rounded-lg border-2 transition-all ${
                          bgColor === bg.value
                            ? 'border-[#E30613] bg-[#E30613]/10'
                            : 'border-[#262626] bg-[#1a1a1a] hover:border-[#333]'
                        }`}
                      >
                        <div
                          className="w-full h-12 rounded mb-2 border border-white/10"
                          style={{
                            background: bg.value
                          }}
                        />
                        <span className="text-sm text-white font-medium">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#1C3A3A] via-black to-[#8B3A3A] border border-[#E30613]/30 rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                A História do Lampião
              </h2>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl mb-4">🏮</div>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Amsterdam 1385</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Lampiões a óleo iluminavam as ruas do Red Light District,
                    guiando marinheiros através da névoa dos canais.
                  </p>
                </div>

                <div>
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Símbolo de Luz</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A chama vermelha dentro do vidro representava calor, vida,
                    e o convite para experiências além do comum.
                  </p>
                </div>

                <div>
                  <div className="text-5xl mb-4">🔥</div>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Botafogo 2025</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Hoje ressignificamos essa luz: não mais nas ruas,
                    mas dentro de nós. O lampião ilumina o caminho da autenticidade.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
