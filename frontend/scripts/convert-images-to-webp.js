/**
 * Script para converter imagens PNG/JPG para WebP
 *
 * Uso: node scripts/convert-images-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images/cardapio');
const OUTPUT_DIR = path.join(__dirname, '../public/images/cardapio');

// Criar diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   Economia: ${savings}% (${(inputSize / 1024).toFixed(1)}KB → ${(outputSize / 1024).toFixed(1)}KB)`);

    return { success: true, savings: parseFloat(savings), inputSize, outputSize };
  } catch (error) {
    console.error(`❌ Erro ao converter ${inputPath}:`, error.message);
    return { success: false, savings: 0, inputSize: 0, outputSize: 0 };
  }
}

async function convertAllImages() {
  console.log('🖼️  Convertendo imagens para WebP...\n');

  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter((file) =>
    /\.(png|jpg|jpeg)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log('Nenhuma imagem PNG/JPG encontrada.');
    return;
  }

  console.log(`Encontradas ${imageFiles.length} imagens para converter.\n`);

  const results = [];
  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputFile = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    // Pular se WebP já existe e é mais recente
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);

      if (outputStat.mtime > inputStat.mtime) {
        console.log(`⏭️  ${file} → já convertido (pulando)`);
        continue;
      }
    }

    const result = await convertImage(inputPath, outputPath);
    results.push(result);
  }

  // Estatísticas
  const successful = results.filter((r) => r.success).length;
  const totalInputSize = results.reduce((sum, r) => sum + r.inputSize, 0);
  const totalOutputSize = results.reduce((sum, r) => sum + r.outputSize, 0);
  const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);

  console.log('\n📊 Estatísticas:');
  console.log(`   Imagens convertidas: ${successful}/${imageFiles.length}`);
  console.log(`   Tamanho original: ${(totalInputSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Tamanho final: ${(totalOutputSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Economia total: ${totalSavings}%`);
  console.log('\n✅ Conversão concluída!');
}

convertAllImages().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
