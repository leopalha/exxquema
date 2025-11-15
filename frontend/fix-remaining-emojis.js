const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'slidesData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Remover emojis específicos que sobraram em textos
content = content.replace(/'🍽️ Comida/g, "'Comida");
content = content.replace(/'🎵 Experiência/g, "'Experiência");
content = content.replace(/'👥 Funcionários/g, "'Funcionários");
content = content.replace(/'→ R\$ 65 margem bruta ✅'/g, "'→ R$ 65 margem bruta'");
content = content.replace(/'💰 CAPITAL DE GIRO/g, "'CAPITAL DE GIRO");
content = content.replace(/GERA \+R\$ 19k ✅/g, "GERA +R$ 19k");
content = content.replace(/GERA \+R\$ 80k ✅/g, "GERA +R$ 80k");
content = content.replace(/'⚠️ Fases 5 e 6/g, "'Fases 5 e 6");

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Emojis remanescentes removidos!');
