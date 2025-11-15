const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'slidesData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Mapeamento de emojis para nomes de ícones
const emojiMap = {
  // Ícones básicos
  '🍸': 'wine',
  '🎵': 'music',
  '💰': 'dollar-sign',
  '🎯': 'target',
  '👥': 'users',
  '⭐': 'star',
  '🏆': 'award',
  '📈': 'trending-up',
  '💎': 'gem',
  '🏦': 'building-2',
  '📊': 'bar-chart-3',
  '📱': 'smartphone',
  '📦': 'package',
  '✅': 'check-circle',
  '🗑️': 'trash-2',
  '🛡️': 'shield',
  '🏛️': 'landmark',
  '🎉': 'party-popper',
  '🔧': 'wrench',
  '⚔️': 'swords',
  '💀': 'skull',
  '🕐': 'clock',
  '😟': 'frown',
  '😊': 'smile',
  '🚀': 'rocket',
  '💼': 'briefcase',
  '📉': 'trending-down',
  '➡️': 'arrow-right',
  '🔥': 'flame',
  '🎭': 'home',
  '🌟': 'star',
  '⏰': 'clock',
  '🏗️': 'building',
  '⚙️': 'settings',
  '📋': 'file-text',
  '🍽️': 'utensils',
  '🤝': 'handshake'
};

// Substituir emojis em icons
Object.keys(emojiMap).forEach(emoji => {
  const iconName = emojiMap[emoji];
  // Substituir em icon: 'emoji'
  content = content.replace(new RegExp(`icon: '${emoji}'`, 'g'), `icon: '${iconName}'`);
  // Substituir em emoji: 'emoji'
  content = content.replace(new RegExp(`emoji: '${emoji}'`, 'g'), `emoji: '${iconName}'`);
});

// Remover emojis dos títulos
const titleEmojis = ['💰', '📊', '💵', '⏱️', '⚙️', '🍸', '👥', '📱', '🤝', '📜', '⚖️', '🚀', '⚠️', '🎯', '📅', '❓'];
titleEmojis.forEach(emoji => {
  content = content.replace(new RegExp(`title: '${emoji} `, 'g'), `title: '`);
});

// Remover emojis de marcadores de texto
const markers = ['✅', '❌', '⚠️', '🛡️', '⚡', '🎯', '📌', '📅', '📊', '🤝', '🏷️', '💳', '💸', '🔒', '⚖️', '🛒', '🏢', '📱', '📍', '👔'];
markers.forEach(emoji => {
  content = content.replace(new RegExp(`'${emoji} `, 'g'), `'`);
});

// Remover numeração com emojis
content = content.replace(/1️⃣ /g, '1. ');
content = content.replace(/2️⃣ /g, '2. ');
content = content.replace(/3️⃣ /g, '3. ');

// Substituir nos labels
content = content.replace(/label: '💰 LUCRO LÍQUIDO'/g, "label: 'LUCRO LÍQUIDO'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Emojis substituídos com sucesso!');
