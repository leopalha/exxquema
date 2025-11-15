// EXXQUEMA - Logo Tipográfica Elegante
// Inspiração: Hollandaise - Estilo clássico-moderno com lettering refinado

const ExxquemaLogo = ({ color = "#FF6B35", size = 60, compact = false, badge = false, supreme = false }) => {

  // Versão Supreme Style
  if (supreme) {
    return (
      <svg width={size * 2.8} height={size * 0.7} viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="400" height="100" fill="#FF6B35" rx="2"/>
        <text x="25" y="75" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="62" fontWeight="900" fontStyle="italic" fill="#FFFFFF" letterSpacing="0">Exxquema</text>
      </svg>
    );
  }

  // Versão Badge Circular para header/footer
  if (badge) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" stroke="#FF6B35" strokeWidth="3" fill="#000000"/>
        <circle cx="100" cy="100" r="85" stroke="#F7931E" strokeWidth="1" fill="none" opacity="0.3"/>
        {/* E */}
        <path d="M50 70 L50 130 L75 130 M50 100 L70 100 M50 70 L75 70" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        {/* XX */}
        <path d="M85 70 L110 130 M110 70 L85 130" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M120 70 L145 130 M145 70 L120 130" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // Versão compacta para header
  if (compact) {
    return (
      <svg width={size * 3.5} height={size} viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Logo compacto - Lettering elegante */}

        {/* E */}
        <g>
          <path d="M 15 15 L 15 65 L 50 65" stroke={color} strokeWidth="4" strokeLinecap="square" fill="none"/>
          <path d="M 15 40 L 45 40" stroke={color} strokeWidth="4" strokeLinecap="square"/>
          <path d="M 15 15 L 50 15" stroke={color} strokeWidth="4" strokeLinecap="square"/>
          <line x1="48" y1="13" x2="52" y2="17" stroke="#F7931E" strokeWidth="2"/>
        </g>

        {/* X */}
        <g>
          <path d="M 60 15 L 85 65" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <path d="M 85 15 L 60 65" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <circle cx="72.5" cy="40" r="3" fill="#F7931E"/>
        </g>

        {/* X (segundo) */}
        <g>
          <path d="M 95 15 L 120 65" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <path d="M 120 15 L 95 65" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <circle cx="107.5" cy="40" r="3" fill="#F7931E"/>
        </g>

        {/* Q */}
        <g>
          <ellipse cx="152.5" cy="37" rx="20" ry="25" stroke={color} strokeWidth="4" fill="none"/>
          <path d="M 165 55 L 175 68" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <circle cx="152.5" cy="37" r="8" fill={color} opacity="0.2"/>
        </g>

        {/* U */}
        <g>
          <path d="M 185 15 L 185 50 Q 185 65 200 65 Q 215 65 215 50 L 215 15" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
        </g>

        {/* E */}
        <g>
          <path d="M 230 15 L 230 65 L 265 65" stroke={color} strokeWidth="4" strokeLinecap="square" fill="none"/>
          <path d="M 230 40 L 260 40" stroke={color} strokeWidth="4" strokeLinecap="square"/>
          <path d="M 230 15 L 265 15" stroke={color} strokeWidth="4" strokeLinecap="square"/>
          <line x1="263" y1="13" x2="267" y2="17" stroke="#F7931E" strokeWidth="2"/>
        </g>

        {/* M */}
        <g>
          <path d="M 275 65 L 275 15 L 290 35 L 305 15 L 305 65" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>

        {/* A */}
        <g>
          <path d="M 315 65 L 330 15 L 345 65" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <line x1="320" y1="47" x2="340" y2="47" stroke={color} strokeWidth="4"/>
        </g>
      </svg>
    );
  }

  // Versão completa com detalhes
  return (
    <svg width={size * 4.5} height={size * 1.5} viewBox="0 0 580 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Logo completo - Exxquema elegante */}

      <defs>
        <linearGradient id="elegantGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35"/>
          <stop offset="50%" stopColor="#F7931E"/>
          <stop offset="100%" stopColor="#FF6B35"/>
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Linha decorativa superior */}
      <line x1="50" y1="15" x2="570" y2="15" stroke="url(#elegantGrad)" strokeWidth="1" opacity="0.4"/>

      {/* E */}
      <g filter="url(#glow)">
        <path d="M 50 35 L 50 115 L 100 115" stroke={color} strokeWidth="6" strokeLinecap="square" fill="none"/>
        <path d="M 50 75 L 95 75" stroke={color} strokeWidth="6" strokeLinecap="square"/>
        <path d="M 50 35 L 100 35" stroke={color} strokeWidth="6" strokeLinecap="square"/>
        {/* Detalhe ornamental */}
        <circle cx="100" cy="35" r="4" fill="#F7931E"/>
        <circle cx="100" cy="115" r="4" fill="#F7931E"/>
      </g>

      {/* X */}
      <g filter="url(#glow)">
        <path d="M 115 35 L 155 115" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        <path d="M 155 35 L 115 115" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        {/* Centro do X */}
        <circle cx="135" cy="75" r="5" fill="#F7931E"/>
        {/* Pequenos ornamentos */}
        <circle cx="115" cy="35" r="3" fill={color} opacity="0.6"/>
        <circle cx="155" cy="35" r="3" fill={color} opacity="0.6"/>
      </g>

      {/* X (segundo) - espelhado */}
      <g filter="url(#glow)">
        <path d="M 170 35 L 210 115" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        <path d="M 210 35 L 170 115" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        <circle cx="190" cy="75" r="5" fill="#F7931E"/>
        <circle cx="170" cy="115" r="3" fill={color} opacity="0.6"/>
        <circle cx="210" cy="115" r="3" fill={color} opacity="0.6"/>
      </g>

      {/* Q */}
      <g filter="url(#glow)">
        <ellipse cx="257" cy="72" rx="32" ry="40" stroke={color} strokeWidth="6" fill="none"/>
        <path d="M 280 105 L 295 125" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        {/* Detalhe interno */}
        <circle cx="257" cy="72" r="12" fill={color} opacity="0.15"/>
        <circle cx="295" cy="125" r="4" fill="#F7931E"/>
      </g>

      {/* U */}
      <g filter="url(#glow)">
        <path d="M 310 35 L 310 90 Q 310 115 335 115 Q 360 115 360 90 L 360 35"
              stroke={color} strokeWidth="6" strokeLinecap="round" fill="none"/>
        {/* Ornamentos no topo */}
        <line x1="307" y1="30" x2="313" y2="35" stroke="#F7931E" strokeWidth="2"/>
        <line x1="357" y1="30" x2="363" y2="35" stroke="#F7931E" strokeWidth="2"/>
      </g>

      {/* E */}
      <g filter="url(#glow)">
        <path d="M 380 35 L 380 115 L 430 115" stroke={color} strokeWidth="6" strokeLinecap="square" fill="none"/>
        <path d="M 380 75 L 425 75" stroke={color} strokeWidth="6" strokeLinecap="square"/>
        <path d="M 380 35 L 430 35" stroke={color} strokeWidth="6" strokeLinecap="square"/>
        <circle cx="430" cy="35" r="4" fill="#F7931E"/>
        <circle cx="430" cy="115" r="4" fill="#F7931E"/>
      </g>

      {/* M */}
      <g filter="url(#glow)">
        <path d="M 445 115 L 445 35 L 470 70 L 495 35 L 495 115"
              stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Ponto no pico */}
        <circle cx="470" cy="70" r="4" fill="#F7931E"/>
      </g>

      {/* A */}
      <g filter="url(#glow)">
        <path d="M 510 115 L 535 35 L 560 115"
              stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="518" y1="85" x2="552" y2="85" stroke={color} strokeWidth="6"/>
        {/* Topo do A */}
        <circle cx="535" cy="35" r="4" fill="#F7931E"/>
      </g>

      {/* Linha decorativa inferior */}
      <line x1="50" y1="135" x2="570" y2="135" stroke="url(#elegantGrad)" strokeWidth="1" opacity="0.4"/>

      {/* Pequenos detalhes ornamentais nos cantos */}
      <circle cx="40" cy="15" r="2" fill="#F7931E" opacity="0.5"/>
      <circle cx="575" cy="15" r="2" fill="#F7931E" opacity="0.5"/>
      <circle cx="40" cy="135" r="2" fill={color} opacity="0.5"/>
      <circle cx="575" cy="135" r="2" fill={color} opacity="0.5"/>
    </svg>
  );
};

export default ExxquemaLogo;
