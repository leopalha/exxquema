// 📅 DADOS DA PROGRAMAÇÃO SEMANAL EXXQUEMA
// Identidade: Laranja #FF6B35 + Preto #0A0A0A

export const programacaoSemanal = [
  {
    id: 'quinta',
    dia: 'QUINTA-FEIRA',
    diaSemana: 4, // 0 = domingo, 4 = quinta
    titulo: 'Esquema Acústico',
    emoji: '🎵',
    subtitulo: 'Música ao vivo + happy hour imbatível',
    descricaoCurta: 'O esquema perfeito para começar o findi.',
    descricaoCompleta: 'Toda quinta o Exxquema vira palco de talentos locais. Violão, voz e muita vibe boa enquanto você curte nosso Happy Hour 2x1. Perfeito para after work, primeira date ou encontro com amigos.',

    horarios: [
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Happy Hour Esquema Duplo',
        descricao: '2x1 em drinks selecionados'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'Show Acústico ao vivo',
        descricao: 'Músicos locais em apresentação intimista'
      },
      {
        inicio: '22:00',
        fim: '02:00',
        atividade: 'DJ Set Chill',
        descricao: 'Indie, MPB moderna, jazz suave'
      }
    ],

    promocoes: [
      {
        icone: '🍹',
        titulo: 'Happy Hour 2x1',
        descricao: 'Gin tônica, caipirinha e cervejas',
        validade: 'até 20h'
      },
      {
        icone: '🍔',
        titulo: 'Combo Jantinha',
        preco: 'R$ 65',
        descricao: '1 prato + 2 drinks'
      },
      {
        icone: '🍺',
        titulo: 'Chopp',
        preco: 'R$ 10',
        descricao: 'até 21h'
      }
    ],

    lineup: [
      { semana: 1, data: '05/12', artista: 'Maria Silva', genero: 'MPB/Bossa' },
      { semana: 2, data: '12/12', artista: 'João Santos', genero: 'Folk/Indie' },
      { semana: 3, data: '19/12', artista: 'Duo Acústico', genero: 'Pop Nacional' },
      { semana: 4, data: '26/12', artista: 'Especial Fim de Ano', genero: 'Repertório Natalino' }
    ],

    musica: ['Acústico', 'MPB', 'Indie', 'Jazz suave'],
    publico: '25-45 anos, casais, grupos after work',
    dressCode: 'Casual smart',
    reserva: 'Recomendada para grupos 6+'
  },

  {
    id: 'sexta',
    dia: 'SEXTA-FEIRA',
    diaSemana: 5,
    titulo: 'Esquema DJ',
    emoji: '🎧',
    subtitulo: 'DJ convidado toda sexta + lista VIP',
    descricaoCurta: 'A noite perfeita em Botafogo.',
    descricaoCompleta: 'Sexta é dia de trazer os melhores DJs do Rio para o Exxquema. Tech house, deep house e muito brazilian bass. Entra na lista VIP pelo Instagram e pula a fila. Esquema garantido!',

    horarios: [
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Happy Hour Esquema Duplo',
        descricao: '2x1 em drinks selecionados'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'Warm Up DJ',
        descricao: 'DJ residente preparando a vibe'
      },
      {
        inicio: '22:00',
        fim: '01:00',
        atividade: 'DJ Convidado',
        descricao: 'Set completo - Tech House / Deep House'
      },
      {
        inicio: '01:00',
        fim: '02:00',
        atividade: 'Closing Set',
        descricao: 'Fechando a noite com classe'
      }
    ],

    promocoes: [
      {
        icone: '🎟',
        titulo: 'Lista VIP',
        descricao: 'Sem fila - cadastro nos stories',
        preco: 'Grátis'
      },
      {
        icone: '🥃',
        titulo: 'Torre 10 Shots',
        preco: 'R$ 180',
        descricao: 'Compartilha com os amigos'
      },
      {
        icone: '🍾',
        titulo: 'Pacote Friends',
        preco: 'R$ 380',
        descricao: '2 garrafas + mixers + petiscos'
      }
    ],

    lineup: [
      { semana: 1, data: '06/12', artista: 'DJ Vini Martins', genero: 'Tech House', bpm: '125-128' },
      { semana: 2, data: '13/12', artista: 'DJ Ana Beatriz', genero: 'Melodic Techno', bpm: '120-125' },
      { semana: 3, data: '20/12', artista: 'DJ Murillo', genero: 'Brazilian Bass', bpm: '128-130' },
      { semana: 4, data: '27/12', artista: 'Especial Reveillon', genero: '3 DJs + surpresas', bpm: '120-130' }
    ],

    musica: ['Deep House', 'Tech House', 'Brazilian Bass'],
    bpm: '120-128',
    publico: '22-35 anos, grupos de amigos, energia alta',
    dressCode: 'Urbano descontraído (nada de chinelo)',
    reserva: 'Essencial para mesas/área superior'
  },

  {
    id: 'sabado',
    dia: 'SÁBADO',
    diaSemana: 6,
    titulo: 'Esquema Total',
    emoji: '🔥',
    subtitulo: 'Melhor noite da semana',
    descricaoCurta: 'DJ premium + casa lotada até tarde.',
    descricaoCompleta: 'Sábado no Exxquema é LOTA. Melhor DJ da semana, drinks fluindo e a galera mais animada de Botafogo. Temas mensais deixam tudo ainda mais épico. Esse é o esquema que você NÃO pode perder.',
    destaque: true,

    horarios: [
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Sunset Pre-Party',
        descricao: 'Aquecendo para a noite'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'Esquema Warming',
        descricao: 'DJ residente elevando a energia'
      },
      {
        inicio: '22:00',
        fim: '02:00',
        atividade: 'FESTA TOTAL',
        descricao: 'DJ Premium - a noite explode!'
      }
    ],

    promocoes: [
      {
        icone: '🍾',
        titulo: 'Garrafa Esquemática',
        preco: 'R$ 220',
        descricao: 'Vodka/Gin + mesa reservada 2h'
      },
      {
        icone: '🥃',
        titulo: 'Torre de Shots LED',
        preco: 'R$ 180',
        descricao: 'Iluminação especial'
      },
      {
        icone: '🎁',
        titulo: 'Aniversariante',
        descricao: 'Entrada grátis + drink',
        preco: 'Free'
      }
    ],

    lineup: [
      { semana: 1, data: '07/12', artista: 'DJ Papatinho', genero: 'House Brasileiro', bpm: '125-130' },
      { semana: 2, data: '14/12', artista: 'DJ Carol', genero: 'Disco House', bpm: '120-126' },
      { semana: 3, data: '21/12', artista: 'DJ Pedro', genero: 'Progressive House', bpm: '128-132' },
      { semana: 4, data: '28/12', artista: 'REVEILLON ESPECIAL', genero: 'Line-up secreto', bpm: '120-132' }
    ],

    temaMes: {
      nome: 'Anos 2000 Party',
      emoji: '🎊',
      descricao: 'Playlist: hits 2000-2010',
      dressCode: 'Roupas dos anos 2000 (opcional)',
      premio: 'Melhor look ganha garrafa'
    },

    musica: ['Progressive House', 'Tech House', 'Brazilian Vibes'],
    bpm: '122-130',
    publico: '25-40 anos, celebrações, grupos grandes',
    dressCode: 'Festa (se produza!)',
    reserva: 'OBRIGATÓRIA (casa lota às 22h)',
    atencao: '⚠ Casa atinge capacidade máxima. Reserve ou chegue cedo!'
  },

  {
    id: 'domingo',
    dia: 'DOMINGO',
    diaSemana: 0,
    titulo: 'Esquema Relax',
    emoji: '🌅',
    subtitulo: 'Jazz, bossa e MPB ao vivo',
    descricaoCurta: 'Vibe sunset para fechar o findi com classe.',
    descricaoCompleta: 'Domingo é o dia de desacelerar com estilo. Jazz ao vivo, drinks clássicos e aquela vibe de "não quero que o fim de semana acabe". Perfeito para casais, encontros ou simplesmente curtir música boa.',

    horarios: [
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Sunset Session',
        descricao: 'MPB / Bossa Nova'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'Jazz ao vivo',
        descricao: 'Standards e clássicos'
      },
      {
        inicio: '22:00',
        fim: '00:00',
        atividade: 'Bossa Lounge',
        descricao: 'DJ set relaxante'
      }
    ],

    promocoes: [
      {
        icone: '🍷',
        titulo: 'Vinho da casa',
        preco: 'R$ 90',
        descricao: 'garrafa'
      },
      {
        icone: '🍹',
        titulo: 'Drinks clássicos',
        descricao: 'Old Fashioned, Manhattan, Negroni',
        desconto: '-20%'
      },
      {
        icone: '🍽',
        titulo: 'Combo Domingo',
        preco: 'R$ 78',
        descricao: 'prato + 2 drinks'
      }
    ],

    lineup: [
      { semana: 1, data: '08/12', artista: 'Trio Bossa Carioca', genero: 'Bossa Nova' },
      { semana: 2, data: '15/12', artista: 'Jazz Standards', genero: 'Jazz Covers' },
      { semana: 3, data: '22/12', artista: 'MPB Moderna', genero: 'Releituras MPB' },
      { semana: 4, data: '29/12', artista: 'Especial Fim de Ano', genero: 'Best Of 2024' }
    ],

    musica: ['Bossa Nova', 'Jazz', 'MPB Moderna'],
    bpm: '80-100',
    publico: '28-50 anos, casais, música ao vivo lovers',
    dressCode: 'Casual elegante',
    reserva: 'Recomendada (ambiente mais intimista)'
  }
];

// 🎉 EVENTOS ESPECIAIS MENSAIS
export const eventosEspeciais = [
  {
    id: 'esquema-cego',
    titulo: 'Esquema Cego',
    emoji: '🎭',
    tipo: 'Speed Dating + Networking',
    descricao: 'Conhecer gente nova com drinks na mão e quebra-gelo divertido.',
    frequencia: '1x por mês - sempre 3ª sexta',
    proximaData: '15 de Dezembro (Sexta)',

    comoFunciona: [
      'Inscrição prévia (Instagram/site)',
      'Match aleatório para mesas compartilhadas',
      '1 drink de boas-vindas incluso',
      'Jogo quebra-gelo fornecido',
      'Rotação a cada 15min',
      'Conexões reais acontecem!'
    ],

    inclui: [
      '1 drink de entrada',
      'Jogo quebra-gelo',
      'Nome tag personalizado',
      'Playlist especial R&B/Soul'
    ],

    investimento: 'R$ 60/pessoa',
    vagas: '40 pessoas (20 homens / 20 mulheres)',
    horario: '20h-00h',
    dressCode: 'Arrumadinho (primeira impressão importa!)'
  },

  {
    id: 'esquema-corporativo',
    titulo: 'Esquema Corporativo',
    emoji: '💼',
    tipo: 'After Office Privativo',
    descricao: 'After office privativo para sua empresa. Open bar, petiscos e DJ exclusivo.',
    frequencia: 'Sob demanda',

    inclui: [
      'Espaço superior reservado',
      'Open bar 2h (drinks selecionados)',
      'Petiscos inclusos',
      'DJ/playlist personalizada',
      'Decoração com logo empresa (opcional)'
    ],

    investimento: 'R$ 120/pessoa (mínimo 30 pessoas)',
    horario: '18h-22h (flexível)',

    idealPara: [
      'Confraternizações',
      'Team building',
      'Comemoração resultados',
      'Networking empresas'
    ]
  },

  {
    id: 'esquema-aniversario',
    titulo: 'Esquema Aniversário',
    emoji: '🎂',
    tipo: 'Comemoração Especial',
    descricao: 'Comemore seu aniversário com estilo no Exxquema!',

    inclui: [
      'Bolo + vela + cantoria',
      '1 drink especial grátis',
      'Post nos stories @exxquema',
      '10% desconto na conta do grupo'
    ],

    investimento: 'A partir de R$ 180 (bolo + decoração básica)',
    minPessoas: '8 pessoas',
    horarioCantoria: '22h',

    adicionais: [
      { item: 'Decoração temática', preco: '+R$ 150' },
      { item: 'Foto profissional', preco: '+R$ 200' },
      { item: 'Garrafa personalizada', preco: '+R$ 100' }
    ],

    comoFunciona: [
      'Avisar com 3 dias de antecedência',
      'Escolher sabor bolo',
      'Reservar mesa (mínimo 8 pessoas)',
      'No dia: cantoria às 22h'
    ]
  },

  {
    id: 'esquema-reveillon',
    titulo: 'Esquema Reveillon',
    emoji: '🎆',
    tipo: 'Festa de Fim de Ano',
    descricao: 'A virada mais esquemática de Botafogo!',
    data: '31 de Dezembro',

    inclui: [
      'Open bar premium 5h',
      'Ceia de Ano Novo',
      'DJ + banda ao vivo',
      'Espumante na virada',
      'Brinde especial'
    ],

    investimento: 'R$ 350/pessoa (lote promocional)',
    horario: '21h-04h',
    vagas: 'Limitadas - reserve com antecedência',
    dressCode: 'Festa (branco ou dourado)'
  }
];

// 🍹 HAPPY HOUR PERMANENTE
export const happyHour = {
  titulo: 'Esquema Duplo - Happy Hour',
  emoji: '🔶',
  descricao: '2 DRINKS PELO PREÇO DE 1',
  horario: 'Segunda a Domingo | 18h às 20h',

  validoPara: [
    'Gin Tônica',
    'Caipirinha',
    'Cerveja Long Neck',
    'Drinks selecionados'
  ],

  combo: {
    nome: 'Combo Esquema Perfeito',
    preco: 'R$ 45',
    inclui: '2 drinks + 1 petisco'
  }
};

// ❓ FAQ
export const faq = [
  {
    pergunta: 'Preciso reservar mesa?',
    resposta: 'Para quinta e domingo, recomendado para grupos 6+. Para sexta e sábado, reserva é essencial pois a casa lota rápido (especialmente após 22h).'
  },
  {
    pergunta: 'Qual o melhor dia para ir?',
    resposta: 'Depende do seu esquema! Quinta para algo mais tranquilo com música ao vivo, sexta para DJ e energia alta, sábado para a festa total, e domingo para relaxar com jazz e bossa.'
  },
  {
    pergunta: 'Tem música ao vivo toda semana?',
    resposta: 'Sim! Toda quinta temos show acústico ao vivo (20h-22h) e todo domingo temos jazz/MPB ao vivo (20h-22h).'
  },
  {
    pergunta: 'Como funciona o Esquema Cego?',
    resposta: 'É um speed dating descontraído! Você se inscreve, recebe um match aleatório, ganha 1 drink e roda entre mesas a cada 15min. Perfeito para conhecer gente nova!'
  },
  {
    pergunta: 'Tem dress code?',
    resposta: 'Quinta e domingo: casual smart/elegante. Sexta: urbano descontraído (sem chinelo). Sábado: festa, se produza! O importante é estar confortável e com estilo.'
  },
  {
    pergunta: 'Posso levar crianças no domingo?',
    resposta: 'Domingo até 20h é mais família friendly por causa da vibe relax. Após 20h, recomendamos 18+.'
  },
  {
    pergunta: 'Como entro na Lista VIP de sexta?',
    resposta: 'Acompanhe nosso Instagram @exxquema! Toda quinta publicamos o cadastro nos stories para a Lista VIP de sexta. É gratuito e você pula a fila.'
  },
  {
    pergunta: 'Qual a capacidade do Exxquema?',
    resposta: 'Temos 150 lugares. Sábados lotam rápido (geralmente 22h já estamos no limite). Reserve com antecedência!'
  },
  {
    pergunta: 'Aceitam cartão?',
    resposta: 'Sim! Aceitamos todos os cartões (débito/crédito), PIX e dinheiro.'
  },
  {
    pergunta: 'Tem estacionamento?',
    resposta: 'Temos convênio com estacionamento a 50m do bar. Apresente o cupom do Exxquema para desconto.'
  }
];

// 🔜 PRÓXIMAS ATRAÇÕES (Timeline)
export const proximasAtracoes = [
  {
    id: 1,
    mes: 'DEZ',
    dia: '15',
    titulo: 'Esquema Cego',
    subtitulo: 'Speed Dating',
    tipo: 'evento-especial',
    status: 'vagas-limitadas'
  },
  {
    id: 2,
    mes: 'DEZ',
    dia: '31',
    titulo: 'Reveillon',
    subtitulo: 'Virada 2025',
    tipo: 'festa-especial',
    status: 'last-tickets'
  },
  {
    id: 3,
    mes: 'JAN',
    dia: '10',
    titulo: 'Esquema Verão',
    subtitulo: 'Festa Tropical',
    tipo: 'tema-mensal',
    status: 'em-breve'
  },
  {
    id: 4,
    mes: 'FEV',
    dia: '14',
    titulo: 'Esquema Love',
    subtitulo: 'Valentine\'s Special',
    tipo: 'evento-especial',
    status: 'em-breve'
  },
  {
    id: 5,
    mes: 'MAR',
    dia: '20',
    titulo: 'Esquema Aniversário',
    subtitulo: '1 Ano Exxquema',
    tipo: 'mega-festa',
    status: 'em-breve'
  }
];

export default {
  programacaoSemanal,
  eventosEspeciais,
  happyHour,
  faq,
  proximasAtracoes
};
