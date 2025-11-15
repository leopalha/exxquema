import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Download, Check, ZoomIn, ArrowLeft } from 'lucide-react';

// Exxquema - Modern Logo Concepts

const LogoSensual1 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Pin-Up - Sentada elegante com pernas cruzadas */}

    {/* Glow background */}
    <circle cx="100" cy="100" r="80" fill={color} opacity="0.05"/>
    <circle cx="100" cy="100" r="60" fill={color} opacity="0.1"/>

    {/* Silhueta em linha contínua - estilo néon */}
    <path
      d="M 90 50 Q 95 45 100 45 Q 105 45 110 50 Q 115 55 115 65 Q 115 70 110 75 L 105 80 Q 100 82 95 80 L 90 75 Q 85 70 85 65 Q 85 55 90 50"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Cabelo longo */}
    <path
      d="M 85 70 Q 80 80 78 95 M 115 70 Q 120 80 122 95"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pescoço e ombros */}
    <path
      d="M 95 80 L 95 90 M 105 80 L 105 90"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Corpo e braços - pose sentada */}
    <path
      d="M 85 90 Q 80 95 75 105 L 70 120 M 115 90 Q 120 95 125 105 Q 128 115 125 125"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Torso */}
    <path
      d="M 90 90 Q 88 110 90 130 M 110 90 Q 112 110 110 130"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pernas cruzadas */}
    <path
      d="M 90 130 Q 85 145 80 160 Q 78 170 82 175 M 110 130 Q 115 140 120 150 Q 122 155 118 160"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Mão no cabelo */}
    <path
      d="M 125 125 Q 120 110 115 95"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Inner glow */}
    <circle cx="100" cy="100" r="25" fill="#FFFFFF" opacity="0.1"/>
  </svg>
);

const LogoSensual2 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Odalisque - Reclinada elegante */}

    {/* Outer glow */}
    <ellipse cx="100" cy="110" rx="90" ry="60" fill={color} opacity="0.08"/>

    {/* Cabeça de perfil */}
    <circle cx="140" cy="70" r="15" stroke={color} strokeWidth="3" fill="none"/>

    {/* Cabelo esvoaçante */}
    <path
      d="M 145 60 Q 155 55 165 58 M 148 65 Q 158 62 168 65 M 150 70 Q 160 68 170 72"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pescoço e ombro */}
    <path
      d="M 135 82 Q 130 88 125 90"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Corpo reclinado */}
    <path
      d="M 125 90 Q 110 95 95 100 Q 75 105 60 110 Q 50 112 45 115"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Curva do quadril */}
    <path
      d="M 95 100 Q 90 115 88 130"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pernas alongadas */}
    <path
      d="M 88 130 Q 82 145 78 160 M 60 110 Q 55 125 52 140"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Braço apoiado */}
    <path
      d="M 125 90 Q 135 95 145 95 Q 150 94 152 90"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Glow central */}
    <ellipse cx="100" cy="110" rx="40" ry="25" fill="#FFFFFF" opacity="0.1"/>
  </svg>
);

const LogoSensual3 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Siren Crest - Brasão com silhueta */}

    {/* Shield/Escudo background */}
    <path
      d="M 100 30 L 140 50 L 145 110 Q 145 140 100 160 Q 55 140 55 110 L 60 50 Z"
      fill={color}
      opacity="0.15"
    />

    {/* Shield border */}
    <path
      d="M 100 30 L 140 50 L 145 110 Q 145 140 100 160 Q 55 140 55 110 L 60 50 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />

    {/* Coroa/Crown no topo */}
    <path
      d="M 85 35 L 90 25 L 95 35 M 95 35 L 100 20 L 105 35 M 105 35 L 110 25 L 115 35"
      stroke="#D4AF37"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Silhueta feminina central - estilo art déco */}
    <circle cx="100" cy="70" r="10" fill={color}/>

    {/* Corpo estilizado */}
    <path
      d="M 100 80 Q 95 85 92 95 M 100 80 Q 105 85 108 95"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Quadril */}
    <path
      d="M 92 95 Q 90 105 92 115 M 108 95 Q 110 105 108 115"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pernas */}
    <path
      d="M 92 115 Q 88 130 90 145 M 108 115 Q 112 130 110 145"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Elementos ornamentais laterais */}
    <path
      d="M 60 80 Q 55 85 60 90 M 140 80 Q 145 85 140 90"
      stroke="#D4AF37"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Banner base com iniciais */}
    <rect x="75" y="150" width="50" height="15" rx="2" fill={color}/>
    <text x="100" y="161" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">R • L</text>
  </svg>
);

const LogoSensual4 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Venus - Inspiração Botticelli em néon */}

    {/* Concha/Shell base */}
    <path
      d="M 50 140 Q 100 120 150 140 L 145 155 Q 100 145 55 155 Z"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />

    {/* Linhas da concha */}
    <path
      d="M 70 140 Q 100 125 130 140 M 80 145 Q 100 133 120 145 M 90 150 Q 100 142 110 150"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      opacity="0.4"
    />

    {/* Glow ao redor */}
    <circle cx="100" cy="85" r="60" fill={color} opacity="0.08"/>

    {/* Cabeça */}
    <circle cx="100" cy="55" r="12" stroke={color} strokeWidth="2.5" fill="none"/>

    {/* Cabelo longo esvoaçante */}
    <path
      d="M 88 55 Q 75 50 70 60 Q 68 70 72 80 M 112 55 Q 125 50 130 60 Q 132 70 128 80"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Cabelo central */}
    <path
      d="M 95 50 Q 90 40 85 45 M 105 50 Q 110 40 115 45"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Corpo - pose clássica Venus */}
    <path
      d="M 100 67 Q 95 75 93 90 Q 92 105 95 120"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    <path
      d="M 100 67 Q 105 75 107 90 Q 108 105 105 120"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Braço cobrindo (pudor) */}
    <path
      d="M 93 80 Q 85 82 80 85 Q 78 88 82 90"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Pernas */}
    <path
      d="M 95 120 Q 92 130 95 140 M 105 120 Q 108 130 105 140"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Auréola/halo */}
    <circle cx="100" cy="55" r="20" stroke={color} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const LogoSensual5 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Silhouette - De costas misteriosa */}

    {/* Glow background */}
    <circle cx="100" cy="100" r="75" fill={color} opacity="0.08"/>

    {/* Cabeça de costas */}
    <circle cx="100" cy="60" r="14" fill={color} opacity="0.3"/>
    <circle cx="100" cy="60" r="14" stroke={color} strokeWidth="2.5" fill="none"/>

    {/* Cabelo longo caindo */}
    <path
      d="M 86 60 Q 80 70 78 85 Q 77 100 80 115 M 90 62 Q 88 75 88 90 M 95 65 Q 94 80 95 95"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Olhar por cima do ombro */}
    <circle cx="108" cy="58" r="2" fill={color}/>
    <path
      d="M 108 62 Q 110 64 112 63"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Ombros desnudos */}
    <path
      d="M 86 74 Q 75 80 68 90 M 114 74 Q 125 80 132 90"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Costas/coluna */}
    <path
      d="M 100 74 L 100 130"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      opacity="0.3"
    />

    {/* Corpo */}
    <path
      d="M 85 90 Q 82 110 85 130 M 115 90 Q 118 110 115 130"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Quadril */}
    <path
      d="M 85 130 Q 80 145 85 160 M 115 130 Q 120 145 115 160"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Braço visível */}
    <path
      d="M 68 90 Q 60 100 58 115"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Inner glow */}
    <ellipse cx="100" cy="105" rx="20" ry="35" fill="#FFFFFF" opacity="0.08"/>
  </svg>
);

const LogoSensual6 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* The Champagne Lady - Com taça, art déco */}

    {/* Círculo art déco */}
    <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="2" fill="none" opacity="0.3"/>
    <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="1" fill="none" opacity="0.2"/>

    {/* Figura central */}
    <circle cx="100" cy="65" r="12" fill={color}/>

    {/* Cabelo bob anos 20 */}
    <path
      d="M 88 65 Q 82 68 85 72 M 112 65 Q 118 68 115 72"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Corpo art déco estilizado */}
    <path
      d="M 95 77 L 92 95 L 88 120 M 105 77 L 108 95 L 112 120"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Braço com taça */}
    <path
      d="M 108 85 Q 120 88 128 85"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Taça de champagne */}
    <path
      d="M 128 75 L 128 85 L 125 90 L 131 90 L 128 85"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
    />
    <circle cx="128" cy="73" r="4" stroke={color} strokeWidth="2" fill="none"/>

    {/* Bolhas de champagne */}
    <circle cx="132" cy="70" r="1.5" fill={color} opacity="0.6"/>
    <circle cx="135" cy="75" r="1" fill={color} opacity="0.5"/>
    <circle cx="130" cy="68" r="1" fill={color} opacity="0.4"/>

    {/* Vestido/saia */}
    <path
      d="M 88 120 Q 85 135 90 150 M 112 120 Q 115 135 110 150 M 90 150 Q 95 145 100 145 Q 105 145 110 150"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Elementos decorativos art déco */}
    <path
      d="M 60 100 L 70 100 M 130 100 L 140 100"
      stroke="#D4AF37"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    <path
      d="M 100 40 L 100 50 M 100 150 L 100 160"
      stroke="#D4AF37"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Glow central */}
    <circle cx="100" cy="100" r="40" fill={color} opacity="0.05"/>
  </svg>
);

// Mantendo os logos originais também
const LogoConcept1 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="80" r="50" fill={color} opacity="0.1"/>
    <circle cx="100" cy="80" r="40" fill={color} opacity="0.2"/>
    <circle cx="100" cy="80" r="30" fill={color}/>
    <circle cx="100" cy="80" r="20" fill="#FFFFFF" opacity="0.3"/>
    <line x1="85" y1="50" x2="85" y2="110" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    <line x1="100" y1="50" x2="100" y2="110" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <line x1="115" y1="50" x2="115" y2="110" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    <path d="M 70 130 Q 85 125 100 130 T 130 130" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3"/>
    <path d="M 75 140 Q 87.5 136 100 140 T 125 140" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2"/>
    <path d="M 80 150 Q 90 147 100 150 T 120 150" stroke={color} strokeWidth="1.5" fill="none" opacity="0.1"/>
  </svg>
);

const LogoConcept2 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="60" fill={color} opacity="0.1"/>
    <path d="M 70 70 L 70 130 M 70 70 L 95 70 Q 105 70 105 85 Q 105 95 95 95 L 70 95 M 95 95 L 105 130" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M 115 70 L 115 130 L 135 130" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="100" cy="50" r="8" fill={color}/>
    <circle cx="100" cy="50" r="15" fill={color} opacity="0.2"/>
  </svg>
);

const LogoConcept3 = ({ color = "#E30613", size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <rect x="50" y="50" width="100" height="100" rx="4" fill={color} opacity="0.1"/>
    <rect x="60" y="60" width="80" height="80" rx="2" stroke={color} strokeWidth="3" fill="none"/>
    <line x1="100" y1="60" x2="100" y2="140" stroke={color} strokeWidth="2"/>
    <line x1="60" y1="100" x2="140" y2="100" stroke={color} strokeWidth="2"/>
    <rect x="62" y="62" width="36" height="36" fill={color} opacity="0.3"/>
    <rect x="102" y="62" width="36" height="36" fill={color} opacity="0.5"/>
    <rect x="62" y="102" width="36" height="36" fill={color} opacity="0.4"/>
    <rect x="102" y="102" width="36" height="36" fill={color} opacity="0.6"/>
    <circle cx="100" cy="100" r="15" fill="#FFFFFF" opacity="0.4"/>
  </svg>
);

export default function Logos() {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [category, setCategory] = useState('sensual'); // 'sensual' or 'original'

  const sensualLogos = [
    {
      id: 'S1',
      name: "The Pin-Up",
      subtitle: "Sentada Elegante",
      concept: "Silhueta feminina sentada com pernas cruzadas, mão no cabelo. Estilo pin-up anos 40-50 em néon vermelho. Sensual mas sofisticada, linha contínua minimalista.",
      component: LogoSensual1,
      vibe: "Vintage Glamour • Elegante • Sexy Sofisticado",
      strength: "Icônico, memorável, equilibra sensualidade e classe perfeitamente"
    },
    {
      id: 'S2',
      name: "The Odalisque",
      subtitle: "Reclinada Sensual",
      concept: "Inspirada em pinturas de odalisca, figura reclinada em pose relaxada e sensual. Linhas fluidas, cabelo esvoaçante, extremamente elegante.",
      component: LogoSensual2,
      vibe: "Luxuoso • Artístico • Sensual",
      strength: "Alta sofisticação, referência histórica às artes, luxúria refinada"
    },
    {
      id: 'S3',
      name: "The Siren Crest",
      subtitle: "Brasão da Sereia",
      concept: "Silhueta feminina em escudo heráldico com coroa dourada. Combina luxúria com nobreza. Elementos art déco, iniciais RL na base.",
      component: LogoSensual3,
      vibe: "Heráldico • Luxuoso • Poderoso",
      strength: "Único, combina tradição européia com sensualidade moderna"
    },
    {
      id: 'S4',
      name: "The Venus",
      subtitle: "Vênus em Néon",
      concept: "Inspirado em 'O Nascimento de Vênus' de Botticelli. Figura clássica emergindo da concha, cabelos ao vento, pose mítica. Arte renascentista em néon moderno.",
      component: LogoSensual4,
      vibe: "Mitológico • Artístico • Atemporal",
      strength: "Luxúria como ARTE, referência cultural sofisticada, não vulgar"
    },
    {
      id: 'S5',
      name: "The Silhouette",
      subtitle: "Mistério de Costas",
      concept: "Silhueta feminina de costas olhando por cima do ombro. Cabelo longo caindo, ombros desnudos. Máximo mistério e convite, extremamente elegante.",
      component: LogoSensual5,
      vibe: "Misterioso • Sedutor • Elegante",
      strength: "Convite visual, joga com o que não se vê, altamente sofisticado"
    },
    {
      id: 'S6',
      name: "The Champagne Lady",
      subtitle: "Dama Art Déco",
      concept: "Figura feminina anos 20 com taça de champagne, cabelo bob, vestido estilizado. Círculos art déco, elementos dourados. Glamour da era do jazz.",
      component: LogoSensual6,
      vibe: "Art Déco • Glamour • Celebração",
      strength: "Evoca era dourada, luxúria celebratória (não escondida), muito chique"
    }
  ];

  const originalLogos = [
    {
      id: 1,
      name: "The Lantern",
      subtitle: "A Lanterna de Amsterdam",
      concept: "Inspirado nas lanternas vermelhas históricas de 1385. Minimalista, com círculo central representando a luz, linhas verticais sutis da estrutura e reflexo nas águas dos canais.",
      component: LogoConcept1,
      vibe: "Histórico • Elegante • Sofisticado",
      strength: "Forte conexão com a história original, clean e memorável"
    },
    {
      id: 2,
      name: "Illuminated Monogram",
      subtitle: "Monograma Iluminado",
      concept: "Letras R e L integradas com ponto de luz acima. Geometria clean, moderna, com elemento histórico (a luz). Equilibra tradição e contemporaneidade.",
      component: LogoConcept2,
      vibe: "Moderno • Direto • Impactante",
      strength: "Altamente versátil, funciona em qualquer tamanho"
    },
    {
      id: 3,
      name: "The Window",
      subtitle: "A Janela de Amsterdam",
      concept: "Referência direta às icônicas janelas do Red Light District. Geometria de quadrantes com luz difusa vermelha. Simbolismo forte e reconhecível.",
      component: LogoConcept3,
      vibe: "Conceitual • Simbólico • Arquitetônico",
      strength: "Narrativa visual forte, instagramável"
    }
  ];

  const logos = category === 'sensual' ? sensualLogos : originalLogos;

  const LogoCard = ({ logo, index }) => {
    const LogoComponent = logo.component;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#E30613] transition-all duration-300 group cursor-pointer"
        onClick={() => {
          setSelectedLogo(logo);
          setViewMode('detail');
        }}
      >
        <div className="relative aspect-square bg-black flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(#E30613 1px, transparent 1px), linear-gradient(90deg, #E30613 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}/>
          </div>

          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
            <LogoComponent color="#E30613" size={200} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{logo.name}</h3>
            <p className="text-[#D4AF37] text-sm">{logo.subtitle}</p>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            {logo.concept}
          </p>

          <div className="pt-4 border-t border-[#262626]">
            <p className="text-xs text-gray-500 mb-2">VIBE</p>
            <p className="text-sm text-gray-300">{logo.vibe}</p>
          </div>

          <button className="w-full bg-[#E30613]/10 hover:bg-[#E30613]/20 text-[#E30613] py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-[#E30613] group-hover:text-white">
            <ZoomIn className="w-4 h-4" />
            Ver Detalhes
          </button>
        </div>
      </motion.div>
    );
  };

  const DetailView = ({ logo }) => {
    const LogoComponent = logo.component;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 overflow-y-auto"
      >
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{logo.name}</h2>
                <p className="text-[#D4AF37] text-lg">{logo.subtitle}</p>
              </div>
              <button
                onClick={() => setViewMode('grid')}
                className="bg-[#262626] hover:bg-[#333] text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                ← Voltar
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-black border border-[#262626] rounded-xl p-8">
                  <p className="text-xs text-gray-500 mb-4">FUNDO PRETO</p>
                  <div className="flex items-center justify-center bg-black aspect-square rounded-lg">
                    <LogoComponent color="#E30613" size={300} />
                  </div>
                </div>

                <div className="bg-white border border-[#262626] rounded-xl p-8">
                  <p className="text-xs text-gray-500 mb-4">FUNDO BRANCO</p>
                  <div className="flex items-center justify-center bg-white aspect-square rounded-lg">
                    <LogoComponent color="#E30613" size={300} />
                  </div>
                </div>

                <div className="bg-black border border-[#262626] rounded-xl p-8">
                  <p className="text-xs text-gray-500 mb-4">MONOCROMÁTICO BRANCO</p>
                  <div className="flex items-center justify-center bg-black aspect-square rounded-lg">
                    <LogoComponent color="#FFFFFF" size={300} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Conceito</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {logo.concept}
                  </p>
                  <div className="pt-4 border-t border-[#262626]">
                    <p className="text-sm text-gray-500 mb-2">FORÇA DO CONCEITO</p>
                    <p className="text-white">{logo.strength}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#E30613]/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-[#E30613] mb-4">Vibe</h3>
                  <p className="text-2xl text-white font-semibold">{logo.vibe}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Características</h3>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">Escalabilidade</p>
                      <p className="text-gray-400 text-sm">Funciona de 16px (favicon) a 5m (fachada)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">Versatilidade</p>
                      <p className="text-gray-400 text-sm">Adaptável a múltiplos fundos e aplicações</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">Memorabilidade</p>
                      <p className="text-gray-400 text-sm">Design único e reconhecível</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">Sofisticação</p>
                      <p className="text-gray-400 text-sm">Sensual mas elegante, nunca vulgar</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#E30613] hover:bg-[#B30510] text-white py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Escolher Este
                  </button>
                  <button className="bg-[#262626] hover:bg-[#333] text-white px-6 py-4 rounded-lg font-semibold transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Head>
        <title>Propostas de Logo | Red Light</title>
        <meta name="description" content="Conceitos de identidade visual para Red Light Lounge Bar" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-[#E30613]/20 border border-[#E30613] px-6 py-2 rounded-full mb-6">
                <span className="text-[#E30613] font-semibold">IDENTIDADE VISUAL</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Propostas de Logo
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                Conceitos únicos inspirados em 700 anos de história. De Amsterdam 1385 a Botafogo 2025.
              </p>

              {/* Category Toggle */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setCategory('sensual')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    category === 'sensual'
                      ? 'bg-[#E30613] text-white'
                      : 'bg-[#262626] text-gray-400 hover:bg-[#333]'
                  }`}
                >
                  🔥 Sensual & Luxúria (6)
                </button>
                <button
                  onClick={() => setCategory('original')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    category === 'original'
                      ? 'bg-[#E30613] text-white'
                      : 'bg-[#262626] text-gray-400 hover:bg-[#333]'
                  }`}
                >
                  💡 Conceitos Abstratos (3)
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {logos.map((logo, index) => (
                    <LogoCard key={logo.id} logo={logo} index={index} />
                  ))}
                </motion.div>
              ) : selectedLogo ? (
                <DetailView key="detail" logo={selectedLogo} />
              ) : null}
            </AnimatePresence>

            {viewMode === 'grid' && category === 'sensual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-20 bg-gradient-to-br from-[#1C3A3A] via-black to-[#8B3A3A] border border-[#E30613]/30 rounded-2xl p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Luxúria como Arte
                </h2>

                <p className="text-gray-300 text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                  Estes logos celebram a sensualidade de forma sofisticada e artística.
                  Inspirados em pin-ups vintage, arte renascentista e heráldica européia,
                  cada conceito representa luxúria sem vulgaridade - exatamente como o Red Light District
                  original de Amsterdam: provocante, mas com classe.
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl mb-3">🎨</div>
                    <h3 className="text-lg font-bold text-[#D4AF37] mb-2">Arte, Não Pornografia</h3>
                    <p className="text-gray-400 text-sm">Inspiração em Botticelli, Matisse, Art Déco</p>
                  </div>

                  <div>
                    <div className="text-4xl mb-3">💎</div>
                    <h3 className="text-lg font-bold text-[#D4AF37] mb-2">Luxúria Sofisticada</h3>
                    <p className="text-gray-400 text-sm">Sensual mas elegante, provocante mas chique</p>
                  </div>

                  <div>
                    <div className="text-4xl mb-3">👑</div>
                    <h3 className="text-lg font-bold text-[#D4AF37] mb-2">Heráldica Moderna</h3>
                    <p className="text-gray-400 text-sm">Tradição européia + néon contemporâneo</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
