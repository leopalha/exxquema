import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ImageModal from '../components/ImageModal';
import { Download, Copy, Check } from 'lucide-react';

export default function Logos() {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);

  const logos = [
    {
      id: 0,
      name: 'Red Light Amsterdam - Logo Antigo',
      description: 'Logo original do Red Light - 3 casinhas estilo Amsterdam',
      svg: (
        <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Casa 1 - Esquerda (4 janelas) */}
          <g>
            {/* Corpo */}
            <rect x="10" y="65" width="48" height="85" fill="#CC0000" stroke="#8B0000" strokeWidth="1.5"/>
            {/* Telhado em degraus Amsterdam */}
            <path d="M10 65 L10 57 L16 57 L16 51 L22 51 L22 45 L46 45 L46 51 L52 51 L52 57 L58 57 L58 65" fill="#A01010" stroke="#6B0000" strokeWidth="1.5"/>
            {/* Janelas (2x2) */}
            <rect x="17" y="77" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="22.5" y1="77" x2="22.5" y2="92" stroke="#B8860B" strokeWidth="1"/>
            <line x1="17" y1="84.5" x2="28" y2="84.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="41" y="77" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="46.5" y1="77" x2="46.5" y2="92" stroke="#B8860B" strokeWidth="1"/>
            <line x1="41" y1="84.5" x2="52" y2="84.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="17" y="104" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="22.5" y1="104" x2="22.5" y2="119" stroke="#B8860B" strokeWidth="1"/>
            <line x1="17" y1="111.5" x2="28" y2="111.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="41" y="104" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="46.5" y1="104" x2="46.5" y2="119" stroke="#B8860B" strokeWidth="1"/>
            <line x1="41" y1="111.5" x2="52" y2="111.5" stroke="#B8860B" strokeWidth="1"/>
            {/* Porta */}
            <rect x="25" y="131" width="19" height="19" fill="#4A0000" stroke="#2D0000" strokeWidth="1"/>
          </g>

          {/* Casa 2 - Centro (6 janelas, mais alta) */}
          <g>
            {/* Corpo */}
            <rect x="72" y="40" width="52" height="110" fill="#CC0000" stroke="#8B0000" strokeWidth="1.5"/>
            {/* Telhado em degraus complexo Amsterdam */}
            <path d="M70 40 L70 32 L76 32 L76 26 L82 26 L82 20 L88 20 L88 14 L110 14 L110 20 L116 20 L116 26 L122 26 L122 32 L128 32 L128 40" fill="#A01010" stroke="#6B0000" strokeWidth="1.5"/>
            {/* Janelas (3x2 = 6) */}
            <rect x="79" y="52" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="84.5" y1="52" x2="84.5" y2="66" stroke="#B8860B" strokeWidth="1"/>
            <line x1="79" y1="59" x2="90" y2="59" stroke="#B8860B" strokeWidth="1"/>

            <rect x="109" y="52" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="114.5" y1="52" x2="114.5" y2="66" stroke="#B8860B" strokeWidth="1"/>
            <line x1="109" y1="59" x2="120" y2="59" stroke="#B8860B" strokeWidth="1"/>

            <rect x="79" y="76" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="84.5" y1="76" x2="84.5" y2="90" stroke="#B8860B" strokeWidth="1"/>
            <line x1="79" y1="83" x2="90" y2="83" stroke="#B8860B" strokeWidth="1"/>

            <rect x="109" y="76" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="114.5" y1="76" x2="114.5" y2="90" stroke="#B8860B" strokeWidth="1"/>
            <line x1="109" y1="83" x2="120" y2="83" stroke="#B8860B" strokeWidth="1"/>

            <rect x="79" y="100" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="84.5" y1="100" x2="84.5" y2="114" stroke="#B8860B" strokeWidth="1"/>
            <line x1="79" y1="107" x2="90" y2="107" stroke="#B8860B" strokeWidth="1"/>

            <rect x="109" y="100" width="11" height="14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="114.5" y1="100" x2="114.5" y2="114" stroke="#B8860B" strokeWidth="1"/>
            <line x1="109" y1="107" x2="120" y2="107" stroke="#B8860B" strokeWidth="1"/>
            {/* Porta */}
            <rect x="87" y="128" width="24" height="22" fill="#4A0000" stroke="#2D0000" strokeWidth="1"/>
          </g>

          {/* Casa 3 - Direita (4 janelas) */}
          <g>
            {/* Corpo */}
            <rect x="138" y="68" width="48" height="82" fill="#CC0000" stroke="#8B0000" strokeWidth="1.5"/>
            {/* Telhado em degraus Amsterdam */}
            <path d="M138 68 L138 60 L144 60 L144 54 L150 54 L150 48 L174 48 L174 54 L180 54 L180 60 L186 60 L186 68" fill="#A01010" stroke="#6B0000" strokeWidth="1.5"/>
            {/* Janelas (2x2) */}
            <rect x="145" y="79" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="150.5" y1="79" x2="150.5" y2="94" stroke="#B8860B" strokeWidth="1"/>
            <line x1="145" y1="86.5" x2="156" y2="86.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="169" y="79" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="174.5" y1="79" x2="174.5" y2="94" stroke="#B8860B" strokeWidth="1"/>
            <line x1="169" y1="86.5" x2="180" y2="86.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="145" y="106" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="150.5" y1="106" x2="150.5" y2="121" stroke="#B8860B" strokeWidth="1"/>
            <line x1="145" y1="113.5" x2="156" y2="113.5" stroke="#B8860B" strokeWidth="1"/>

            <rect x="169" y="106" width="11" height="15" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
            <line x1="174.5" y1="106" x2="174.5" y2="121" stroke="#B8860B" strokeWidth="1"/>
            <line x1="169" y1="113.5" x2="180" y2="113.5" stroke="#B8860B" strokeWidth="1"/>
            {/* Porta */}
            <rect x="153" y="132" width="19" height="18" fill="#4A0000" stroke="#2D0000" strokeWidth="1"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 1,
      name: 'Logo Principal - Completo',
      description: 'Logo completo com lettering para uso em fundos escuros',
      svg: (
        <svg width="360" height="80" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* E */}
          <path d="M10 15 L10 65 L40 65 M10 40 L35 40 M10 15 L40 15" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M55 15 L85 65 M85 15 L55 65" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M100 15 L130 65 M130 15 L100 65" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Q */}
          <circle cx="160" cy="40" r="20" stroke="#FF6B35" strokeWidth="4" fill="none"/>
          <path d="M172 52 L182 62" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round"/>
          {/* U */}
          <path d="M195 15 L195 50 Q195 65 210 65 Q225 65 225 50 L225 15" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* E */}
          <path d="M240 15 L240 65 L270 65 M240 40 L265 40 M240 15 L270 15" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* M */}
          <path d="M285 65 L285 15 L305 45 L325 15 L325 65" stroke="#F7931E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* A */}
          <path d="M340 65 L350 15 L360 65 M343 45 L357 45" stroke="#F7931E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 2,
      name: 'Logo Compacto - Ícone',
      description: 'Versão compacta apenas com as letras EXX para uso em avatares e favicons',
      svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* E */}
          <path d="M10 15 L10 65 L40 65 M10 40 L35 40 M10 15 L40 15" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M50 15 L80 65 M80 15 L50 65" stroke="#FF6B35" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M90 15 L120 65 M120 15 L90 65" stroke="#F7931E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 3,
      name: 'Logo Monocromático - Branco',
      description: 'Versão monocromática em branco para fundos coloridos',
      svg: (
        <svg width="360" height="80" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* E */}
          <path d="M10 15 L10 65 L40 65 M10 40 L35 40 M10 15 L40 15" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M55 15 L85 65 M85 15 L55 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M100 15 L130 65 M130 15 L100 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Q */}
          <circle cx="160" cy="40" r="20" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
          <path d="M172 52 L182 62" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
          {/* U */}
          <path d="M195 15 L195 50 Q195 65 210 65 Q225 65 225 50 L225 15" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* E */}
          <path d="M240 15 L240 65 L270 65 M240 40 L265 40 M240 15 L270 15" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* M */}
          <path d="M285 65 L285 15 L305 45 L325 15 L325 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* A */}
          <path d="M340 65 L350 15 L360 65 M343 45 L357 45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      id: 4,
      name: 'Logo Monocromático - Preto',
      description: 'Versão monocromática em preto para fundos claros',
      svg: (
        <svg width="360" height="80" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* E */}
          <path d="M10 15 L10 65 L40 65 M10 40 L35 40 M10 15 L40 15" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M55 15 L85 65 M85 15 L55 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M100 15 L130 65 M130 15 L100 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Q */}
          <circle cx="160" cy="40" r="20" stroke="#000000" strokeWidth="4" fill="none"/>
          <path d="M172 52 L182 62" stroke="#000000" strokeWidth="4" strokeLinecap="round"/>
          {/* U */}
          <path d="M195 15 L195 50 Q195 65 210 65 Q225 65 225 50 L225 15" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* E */}
          <path d="M240 15 L240 65 L270 65 M240 40 L265 40 M240 15 L270 15" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* M */}
          <path d="M285 65 L285 15 L305 45 L325 15 L325 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* A */}
          <path d="M340 65 L350 15 L360 65 M343 45 L357 45" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-white'
    },
    {
      id: 6,
      name: 'Logo Circular - Badge',
      description: 'Versão circular para uso em selos, badges e mídias sociais',
      svg: (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" stroke="#FF6B35" strokeWidth="3" fill="#000000"/>
          <circle cx="100" cy="100" r="85" stroke="#F7931E" strokeWidth="1" fill="none" opacity="0.3"/>
          {/* X */}
          <path d="M32 70 L54 130 M54 70 L32 130" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M64 70 L86 130 M86 70 L64 130" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Q */}
          <circle cx="110" cy="100" r="16" stroke="#F7931E" strokeWidth="3" fill="none"/>
          <path d="M121 111 L128 118" stroke="#F7931E" strokeWidth="3" strokeLinecap="round"/>
          {/* M */}
          <path d="M140 130 L140 70 L153 95 L166 70 L166 130" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 8,
      name: 'Logo Minimalista - Outline',
      description: 'Versão ultra minimalista com linhas finas para aplicações elegantes',
      svg: (
        <svg width="360" height="80" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* E */}
          <path d="M10 15 L10 65 L40 65 M10 40 L35 40 M10 15 L40 15" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M55 15 L85 65 M85 15 L55 65" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* X */}
          <path d="M100 15 L130 65 M130 15 L100 65" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Q */}
          <circle cx="160" cy="40" r="20" stroke="#FF6B35" strokeWidth="1.5" fill="none"/>
          <path d="M172 52 L182 62" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/>
          {/* U */}
          <path d="M195 15 L195 50 Q195 65 210 65 Q225 65 225 50 L225 15" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* E */}
          <path d="M240 15 L240 65 L270 65 M240 40 L265 40 M240 15 L270 15" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* M */}
          <path d="M285 65 L285 15 L305 45 L325 15 L325 65" stroke="#F7931E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* A */}
          <path d="M340 65 L350 15 L360 65 M343 45 L357 45" stroke="#F7931E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 9,
      name: 'Logo Quadrado - Box Badge',
      description: 'Versão em caixa quadrada para apps e ícones',
      svg: (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="190" height="190" rx="20" stroke="#FF6B35" strokeWidth="3" fill="#000000"/>
          <rect x="15" y="15" width="170" height="170" rx="15" stroke="#F7931E" strokeWidth="1" fill="none" opacity="0.3"/>
          {/* E */}
          <path d="M45 70 L45 130 L70 130 M45 100 L65 100 M45 70 L70 70" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {/* XX */}
          <path d="M80 70 L105 130 M105 70 L80 130" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M115 70 L140 130 M140 70 L115 130" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 11,
      name: 'Logo Hexagonal - Geométrico',
      description: 'Versão hexagonal moderna para branding diferenciado',
      svg: (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="hexClip">
              <path d="M100 10 L170 50 L170 150 L100 190 L30 150 L30 50 Z"/>
            </clipPath>
          </defs>
          <path d="M100 10 L170 50 L170 150 L100 190 L30 150 L30 50 Z" stroke="#FF6B35" strokeWidth="3" fill="#000000"/>
          <path d="M100 20 L160 55 L160 145 L100 180 L40 145 L40 55 Z" stroke="#F7931E" strokeWidth="1" fill="none" opacity="0.3"/>
          {/* E */}
          <path d="M55 75 L55 125 L75 125 M55 100 L70 100 M55 75 L75 75" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {/* XX */}
          <path d="M85 75 L105 125 M105 75 L85 125" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M115 75 L135 125 M135 75 L115 125" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 13,
      name: 'Badge Preto e Laranja - Clássico',
      description: 'Badge circular premium - fundo preto com letras laranjas',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FF6B35" strokeWidth="4" fill="#000000"/>
          <circle cx="150" cy="150" r="135" stroke="#F7931E" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#F7931E" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 14,
      name: 'Badge Laranja e Branco - Vibrante',
      description: 'Badge circular - fundo laranja com letras brancas',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FFFFFF" strokeWidth="4" fill="#FF6B35"/>
          <circle cx="150" cy="150" r="135" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-white'
    },
    {
      id: 15,
      name: 'Badge Branco e Laranja - Elegante',
      description: 'Badge circular - fundo branco com letras laranjas',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FF6B35" strokeWidth="4" fill="#FFFFFF"/>
          <circle cx="150" cy="150" r="135" stroke="#F7931E" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#F7931E" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-100'
    },
    {
      id: 16,
      name: 'Badge Dourado e Preto - Premium',
      description: 'Badge circular - fundo dourado com letras pretas',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#000000" strokeWidth="4" fill="#F7931E"/>
          <circle cx="150" cy="150" r="135" stroke="#000000" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#000000" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 17,
      name: 'Badge Azul Navy e Laranja - Moderno',
      description: 'Badge circular - fundo azul navy com letras laranjas',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FF6B35" strokeWidth="4" fill="#001f3f"/>
          <circle cx="150" cy="150" r="135" stroke="#F7931E" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#F7931E" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-800'
    },
    {
      id: 18,
      name: 'Badge Gradiente - Sunset',
      description: 'Badge circular - fundo gradiente laranja para amarelo',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sunsetGrad" cx="50%" cy="50%">
              <stop offset="0%" style={{stopColor: '#F7931E', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#FF6B35', stopOpacity: 1}} />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="145" stroke="#FFFFFF" strokeWidth="4" fill="url(#sunsetGrad)"/>
          <circle cx="150" cy="150" r="135" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.3"/>
          <g transform="translate(42, 110) scale(1.05, 1.35)">
            <path d="M5 10 L5 40 L20 40 M5 25 L18 25 M5 10 L20 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 10 L43 40 M43 10 L28 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 10 L65 40 M65 10 L50 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="80" cy="25" r="12" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
            <path d="M88 33 L95 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
            <path d="M102 10 L102 28 Q102 40 112 40 Q122 40 122 28 L122 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M130 10 L130 40 L145 40 M130 25 L143 25 M130 10 L145 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M153 40 L153 10 L165 25 L177 10 L177 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M185 40 L195 10 L205 40 M188 28 L202 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 19,
      name: 'Supreme Style - Laranja com Branco',
      description: 'Estilo Supreme - fundo laranja com letra branca',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#FF6B35" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FFFFFF" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 20,
      name: 'Supreme Style - Branco sem Fundo',
      description: 'Estilo Supreme - letra branca sem fundo',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FFFFFF" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 21,
      name: 'Supreme Style - Laranja sem Fundo',
      description: 'Estilo Supreme - letra laranja sem fundo',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FF6B35" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 22,
      name: 'Supreme Style - Navy com Laranja',
      description: 'Estilo Supreme - fundo azul navy escuro com letra laranja',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#001f3f" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FF6B35" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 23,
      name: 'Supreme Style - Navy com Branco',
      description: 'Estilo Supreme - fundo azul navy escuro com letra branca',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#001f3f" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FFFFFF" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 24,
      name: 'Supreme Style - Preto com Laranja',
      description: 'Estilo Supreme - fundo preto com letra laranja',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#000000" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FF6B35" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 25,
      name: 'Supreme Style - Verde com Amarelo',
      description: 'Estilo Supreme Brasil - fundo verde com letra amarela',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#009739" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FEDD00" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 26,
      name: 'Supreme Style - Amarelo com Verde',
      description: 'Estilo Supreme Brasil - fundo amarelo com letra verde',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#FEDD00" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#009739" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 27,
      name: 'Supreme Circle - Laranja com Branco',
      description: 'Logo redondo Supreme - fundo laranja com letra branca',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#FF6B35"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FFFFFF" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 28,
      name: 'Supreme Circle - Branco com Laranja',
      description: 'Logo redondo Supreme - fundo branco com letra laranja',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#FFFFFF"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FF6B35" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 29,
      name: 'Supreme Circle - Navy com Laranja',
      description: 'Logo redondo Supreme - fundo navy com letra laranja',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#001f3f"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FF6B35" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 30,
      name: 'Supreme Circle - Navy com Branco',
      description: 'Logo redondo Supreme - fundo navy com letra branca',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#001f3f"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FFFFFF" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 31,
      name: 'Supreme Circle - Preto com Laranja',
      description: 'Logo redondo Supreme - fundo preto com letra laranja',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#000000"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FF6B35" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 32,
      name: 'Supreme Circle - Preto com Branco',
      description: 'Logo redondo Supreme - fundo preto com letra branca',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#000000"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FFFFFF" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 33,
      name: 'Supreme Circle - Laranja com Preto',
      description: 'Logo redondo Supreme - fundo laranja com letra preta',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#FF6B35"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#000000" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 34,
      name: 'Supreme Circle - Amber com Preto',
      description: 'Logo redondo Supreme - fundo amber com letra preta',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#F7931E"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#000000" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 35,
      name: 'Supreme Circle - Verde com Amarelo',
      description: 'Logo redondo Supreme Brasil - fundo verde com letra amarela',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#009739"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FEDD00" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 36,
      name: 'Supreme Circle - Amarelo com Verde',
      description: 'Logo redondo Supreme Brasil - fundo amarelo com letra verde',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#FEDD00"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#009739" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 37,
      name: 'Settor Style - Branco com Ícones',
      description: 'Estilo Settor - texto branco com linha e ícones de networking',
      svg: (
        <svg width="800" height="250" viewBox="0 0 800 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="800" height="250" fill="#000000"/>

          {/* EXXQUEMA Text */}
          <text x="20" y="140" fontFamily="'Impact', 'Arial Black', sans-serif" fontSize="110" fontWeight="900" fill="#FFFFFF" letterSpacing="4">EXXQUEMA</text>

          {/* Horizontal Line */}
          <line x1="20" y1="165" x2="650" y2="165" stroke="#FFFFFF" strokeWidth="6"/>

          {/* Narguile/Hookah Icon */}
          <g transform="translate(670, 30)">
            {/* Vapor/Smoke - 3 linhas onduladas */}
            <path d="M20 10 Q25 5 30 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M25 18 Q30 13 35 18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M30 26 Q35 21 40 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>

            {/* Bowl (tigela) */}
            <ellipse cx="30" cy="45" rx="12" ry="6" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
            <path d="M18 45 L18 52 Q18 56 22 56 L38 56 Q42 56 42 52 L42 45" stroke="#FFFFFF" strokeWidth="3" fill="none"/>

            {/* Stem (haste) */}
            <line x1="30" y1="56" x2="30" y2="85" stroke="#FFFFFF" strokeWidth="3"/>

            {/* Base (vaso) */}
            <ellipse cx="30" cy="85" rx="18" ry="8" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
            <path d="M12 85 Q12 105 30 110 Q48 105 48 85" stroke="#FFFFFF" strokeWidth="3" fill="none"/>

            {/* Hose (mangueira) */}
            <path d="M12 95 Q-5 95 -15 110" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </g>

          {/* House Icon */}
          <g transform="translate(660, 145)">
            <path d="M10 35 L35 10 L60 35 L60 60 L10 60 Z" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <rect x="30" y="40" width="15" height="20" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
          </g>

          {/* Person/Networking Icon */}
          <g transform="translate(730, 30)">
            <circle cx="30" cy="25" r="15" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
            <path d="M30 40 L30 85 M10 55 L50 55" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 100 L30 85 M30 85 L40 100" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 38,
      name: 'Settor Style - Laranja com Ícones',
      description: 'Estilo Settor - texto laranja com linha e ícones de networking',
      svg: (
        <svg width="800" height="250" viewBox="0 0 800 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="800" height="250" fill="#000000"/>

          {/* EXXQUEMA Text */}
          <text x="20" y="140" fontFamily="'Impact', 'Arial Black', sans-serif" fontSize="110" fontWeight="900" fill="#FF6B35" letterSpacing="4">EXXQUEMA</text>

          {/* Horizontal Line */}
          <line x1="20" y1="165" x2="650" y2="165" stroke="#FF6B35" strokeWidth="6"/>

          {/* Narguile/Hookah Icon */}
          <g transform="translate(670, 30)">
            {/* Vapor/Smoke - 3 linhas onduladas */}
            <path d="M20 10 Q25 5 30 10" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M25 18 Q30 13 35 18" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M30 26 Q35 21 40 26" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>

            {/* Bowl (tigela) */}
            <ellipse cx="30" cy="45" rx="12" ry="6" stroke="#FF6B35" strokeWidth="3" fill="none"/>
            <path d="M18 45 L18 52 Q18 56 22 56 L38 56 Q42 56 42 52 L42 45" stroke="#FF6B35" strokeWidth="3" fill="none"/>

            {/* Stem (haste) */}
            <line x1="30" y1="56" x2="30" y2="85" stroke="#FF6B35" strokeWidth="3"/>

            {/* Base (vaso) */}
            <ellipse cx="30" cy="85" rx="18" ry="8" stroke="#FF6B35" strokeWidth="3" fill="none"/>
            <path d="M12 85 Q12 105 30 110 Q48 105 48 85" stroke="#FF6B35" strokeWidth="3" fill="none"/>

            {/* Hose (mangueira) */}
            <path d="M12 95 Q-5 95 -15 110" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </g>

          {/* House Icon */}
          <g transform="translate(660, 145)">
            <path d="M10 35 L35 10 L60 35 L60 60 L10 60 Z" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <rect x="30" y="40" width="15" height="20" stroke="#FF6B35" strokeWidth="3" fill="none"/>
          </g>

          {/* Person/Networking Icon */}
          <g transform="translate(730, 30)">
            <circle cx="30" cy="25" r="15" stroke="#FF6B35" strokeWidth="4" fill="none"/>
            <path d="M30 40 L30 85 M10 55 L50 55" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 100 L30 85 M30 85 L40 100" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 39,
      name: 'Supreme Style - Vermelho com Branco',
      description: 'Estilo Supreme - fundo vermelho com letra branca',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#E30613" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#FFFFFF" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 40,
      name: 'Supreme Style - Branco com Vermelho',
      description: 'Estilo Supreme - fundo branco com letra vermelha',
      svg: (
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="100" fill="#FFFFFF" rx="2"/>
          <text x="30" y="70" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="56" fontWeight="900" fontStyle="italic" fill="#E30613" letterSpacing="0">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 41,
      name: 'Supreme Circle - Vermelho com Branco',
      description: 'Logo redondo Supreme - fundo vermelho com letra branca',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#E30613"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#FFFFFF" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    },
    {
      id: 42,
      name: 'Supreme Circle - Branco com Vermelho',
      description: 'Logo redondo Supreme - fundo branco com letra vermelha',
      svg: (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="#FFFFFF"/>
          <text x="150" y="175" fontFamily="'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif" fontSize="48" fontWeight="900" fontStyle="italic" fill="#E30613" textAnchor="middle" letterSpacing="-1">Exxquema</text>
        </svg>
      ),
      bgColor: 'bg-gray-900'
    }
  ];

  const handleCopy = (id, svgElement) => {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    navigator.clipboard.writeText(svgString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadJPEG = (logoId) => {
    const svgElement = document.querySelector(`#logo-${logoId} svg`);
    const svgString = new XMLSerializer().serializeToString(svgElement);

    // Create a canvas to convert SVG to JPEG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Fill white background for JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the SVG image
      ctx.drawImage(img, 0, 0);

      // Convert to JPEG and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exxquema-logo-${logoId}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  };

  return (
    <>
      <Head>
        <title>Logos | Exxquema - Identidade Visual</title>
        <meta name="description" content="Galeria de logos e variações da identidade visual do Exxquema. Baixe diferentes versões para diversos usos." />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                Identidade <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Visual</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Diferentes variações do logo Exxquema para diversos usos e aplicações
              </p>
            </motion.div>

            {/* Logo Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />

                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 group-hover:border-orange-500/40 transition-all overflow-hidden">
                    {/* Logo Display */}
                    <div
                      className={`${logo.bgColor} p-8 flex items-center justify-center min-h-[250px] relative overflow-hidden cursor-pointer group-hover:scale-105 transition-transform`}
                      onClick={() => setSelectedLogo(logo)}
                    >
                      {/* Subtle pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundSize: '60px 60px'
                        }} />
                      </div>

                      {/* Click hint overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white font-semibold bg-orange-500 px-4 py-2 rounded-lg shadow-lg">
                          Clique para ampliar
                        </span>
                      </div>

                      <div id={`logo-${logo.id}`} style={{ maxWidth: '100%', maxHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {React.cloneElement(logo.svg, {
                            style: { maxWidth: '100%', maxHeight: '200px', width: 'auto', height: 'auto' }
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="p-6 border-t border-gray-800">
                      <h3 className="text-white font-bold text-lg mb-2">{logo.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{logo.description}</p>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const svgElement = document.querySelector(`#logo-${logo.id} svg`);
                            handleCopy(logo.id, svgElement);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-orange-500 border border-gray-700 hover:border-orange-500 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all"
                        >
                          {copiedId === logo.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar SVG
                            </>
                          )}
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const svgElement = document.querySelector(`#logo-${logo.id} svg`);
                              const svgString = new XMLSerializer().serializeToString(svgElement);
                              const blob = new Blob([svgString], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `exxquema-logo-${logo.id}.svg`;
                              a.click();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-orange-500/30"
                          >
                            <Download className="w-4 h-4" />
                            SVG
                          </button>

                          <button
                            onClick={() => handleDownloadJPEG(logo.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-amber-500/30"
                          >
                            <Download className="w-4 h-4" />
                            JPEG
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Diretrizes de Uso</h2>

                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-orange-400 font-semibold mb-2">✓ Permitido</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Usar os logos em materiais promocionais do Exxquema</li>
                      <li>Redimensionar mantendo a proporção original</li>
                      <li>Usar as versões monocromáticas em fundos apropriados</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-red-400 font-semibold mb-2">✗ Não Permitido</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Alterar as cores ou proporções do logo</li>
                      <li>Adicionar efeitos, sombras ou distorções</li>
                      <li>Usar o logo em contextos que prejudiquem a marca</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal de visualização */}
        <ImageModal
          isOpen={selectedLogo !== null}
          onClose={() => setSelectedLogo(null)}
          title={selectedLogo?.name}
        >
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #f97316',
            borderRadius: '1rem',
            padding: '3rem'
          }}>
            {selectedLogo ? (
              <div
                className={selectedLogo.bgColor}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  padding: '2rem'
                }}
              >
                <div style={{
                  transform: 'scale(2.5)',
                  width: 'fit-content',
                  height: 'fit-content',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                }}>
                  {selectedLogo.svg}
                </div>
              </div>
            ) : (
              <div style={{ color: 'white', textAlign: 'center', fontSize: '24px' }}>
                <p>⚠️ Logo não disponível</p>
              </div>
            )}
          </div>
        </ImageModal>
      </Layout>
    </>
  );
}
