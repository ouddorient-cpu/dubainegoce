const fs = require('fs');
const path = require('path');

// Charger les produits
const productsModule = require('./public/js/products-data.js');
const products = productsModule.products || productsModule;

// Dossier contenant les images
const imagesFolder = './public';

// Fonction de normalisation
function normalizeForMatching(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Lire toutes les images PNG
const allFiles = fs.readdirSync(imagesFolder);
const imageFiles = allFiles.filter(file =>
  file.toLowerCase().endsWith('.png') &&
  file !== 'dubainegoce.png' &&
  !file.startsWith('logo')
);

console.log(`📸 ${imageFiles.length} images trouvées dans ${imagesFolder}`);
console.log(`📦 ${products.length} produits dans la base\n`);

const matched = [];
const unmatched = [];
let updateCount = 0;

// Pour chaque image, chercher le produit correspondant
imageFiles.forEach(filename => {
  const nameWithoutExt = path.basename(filename, '.png');
  const normalized = normalizeForMatching(nameWithoutExt);
  const keywords = normalized.split(' ').filter(word => word.length > 3);

  let bestMatch = null;
  let bestScore = 0;

  products.forEach(product => {
    const productNormalized = normalizeForMatching(product.name);
    const productWords = productNormalized.split(' ').filter(word => word.length > 3);

    let score = 0;

    // Correspondance exacte
    if (productNormalized === normalized) {
      score = 1000;
    } else {
      // Mots en commun
      const matchingWords = keywords.filter(word => productWords.includes(word));
      score = matchingWords.length * 10;

      // Bonus si substring match
      if (normalized.includes(productNormalized) || productNormalized.includes(normalized)) {
        score += 20;
      }

      // Bonus pour marque
      const brandNormalized = normalizeForMatching(product.brand);
      if (normalized.includes(brandNormalized)) {
        score += 5;
      }

      // Vérifier les mots clés importants du produit dans le nom de fichier
      const importantWords = productNormalized.split(' ').filter(w =>
        w.length > 4 &&
        !['lattafa', 'alhambra', 'fragrance', 'world', 'dubai', 'perfumes', 'french', 'avenue', 'maison'].includes(w)
      );
      importantWords.forEach(word => {
        if (normalized.includes(word)) {
          score += 15;
        }
      });
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  });

  if (bestMatch && bestScore >= 15) {
    // Mettre à jour l'URL de l'image du produit
    const imageUrl = `/${filename}`;
    bestMatch.image = imageUrl;
    updateCount++;

    matched.push({
      filename,
      productId: bestMatch.id,
      productName: bestMatch.name,
      score: bestScore,
      imageUrl
    });

    console.log(`✅ [${bestScore}] ${filename}`);
    console.log(`   → ${bestMatch.name}\n`);
  } else {
    unmatched.push({
      filename,
      bestCandidate: bestMatch ? bestMatch.name : 'Aucun',
      score: bestScore
    });
    console.log(`⚠️  [${bestScore}] ${filename}`);
    if (bestMatch) {
      console.log(`   Meilleur candidat: ${bestMatch.name}\n`);
    } else {
      console.log(`   Aucune correspondance\n`);
    }
  }
});

// Sauvegarder le fichier products-data.js mis à jour
const productsDataContent = `// PRODUCTS DATA - Parfums DubaiNegoce
// Auto-généré - Ne pas modifier manuellement

const products = ${JSON.stringify(products, null, 2)};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products };
}
`;

fs.writeFileSync('./public/js/products-data.js', productsDataContent, 'utf-8');

// Rapport
console.log('\n' + '='.repeat(70));
console.log('📊 RAPPORT DE MATCHING DES IMAGES LOCALES');
console.log('='.repeat(70));
console.log(`\n✅ Images matchées: ${matched.length}/${imageFiles.length}`);
console.log(`⚠️  Images non matchées: ${unmatched.length}`);
console.log(`📦 Produits mis à jour: ${updateCount}/${products.length}`);

const report = {
  timestamp: new Date().toISOString(),
  totalImages: imageFiles.length,
  matched: matched.length,
  unmatched: unmatched.length,
  productsUpdated: updateCount,
  details: {
    matched,
    unmatched
  }
};

fs.writeFileSync('./local-images-matching-report.json', JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📄 Rapport détaillé: ./local-images-matching-report.json`);

if (matched.length > 0) {
  console.log(`\n✨ EXEMPLES DE MATCHS RÉUSSIS:`);
  matched.slice(0, 5).forEach(item => {
    console.log(`   ${item.filename}`);
    console.log(`   → ${item.productName} [Score: ${item.score}]\n`);
  });
}

console.log('='.repeat(70) + '\n');
console.log('✅ Fichier products-data.js mis à jour avec les images locales!\n');
