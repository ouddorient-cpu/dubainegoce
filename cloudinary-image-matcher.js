const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'dzntnjtkc',
  api_key: '858925468364734',
  api_secret: 'bJBCnCk5X9CTZWWyW8WAyb7P594'
});

// Normalisation des noms pour le matching
function normalizeProductName(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/[^\w\s-]/g, '') // Enlever caractères spéciaux
    .replace(/\s+/g, '-') // Espaces -> tirets
    .replace(/ml/gi, '')
    .replace(/eau-de-parfum/gi, 'edp')
    .replace(/lattafa/gi, '')
    .replace(/alhambra/gi, '')
    .replace(/maison/gi, '')
    .replace(/fragrance-world/gi, '')
    .replace(/dubai-perfumes/gi, '')
    .replace(/french-avenue/gi, '')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .trim();
}

// Mapper les marques avec leurs noms de dossiers possibles
function getBrandFolders(brand) {
  const brandMap = {
    'Lattafa': ['lattafa', 'lattafa-perfumes'],
    'Maison Alhambra': ['alhambra', 'maison-alhambra', 'maison_alhambra'],
    'Fragrance World': ['fragrance-world', 'fragrance_world', 'fragranceworld'],
    'Dubai Perfumes': ['dubai-perfumes', 'dubai_perfumes', 'dubai'],
    'French Avenue': ['french-avenue', 'french_avenue', 'frenchavenue']
  };

  return brandMap[brand] || [brand.toLowerCase().replace(/\s+/g, '-')];
}

async function matchImagesToProducts() {
  console.log('🚀 Démarrage du matching Cloudinary avec dossiers par marque...\n');

  // Charger les produits actuels
  const products = require('./public/js/products-data.js');
  console.log(`📦 ${products.length} produits chargés\n`);

  // Récupérer toutes les images Cloudinary (tous dossiers)
  console.log('☁️  Récupération des images Cloudinary...');

  let allCloudinaryImages = [];
  let nextCursor = null;

  // Pagination pour récupérer toutes les images
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'image',
      next_cursor: nextCursor
    });

    allCloudinaryImages = allCloudinaryImages.concat(result.resources);
    nextCursor = result.next_cursor;

    console.log(`   Récupéré ${allCloudinaryImages.length} images...`);
  } while (nextCursor);

  console.log(`📸 Total: ${allCloudinaryImages.length} images trouvées sur Cloudinary\n`);

  const matched = [];
  const unmatched = [];
  const matchStats = {
    byBrand: {},
    total: products.length
  };

  // Matching produit par produit
  products.forEach((product, index) => {
    const normalizedProductName = normalizeProductName(product.name);

    // Extraire les mots clés principaux du nom
    const productWords = product.name
      .toLowerCase()
      .replace(/\d+ml/gi, '')
      .replace(/–/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 3 && !['lattafa', 'alhambra', 'maison', 'fragrance', 'world', 'dubai', 'perfumes', 'french', 'avenue'].includes(word));

    // Chercher une image correspondante
    let matchedImage = allCloudinaryImages.find(img => {
      const publicId = img.public_id.toLowerCase();
      const imgName = publicId.split('/').pop();
      const imgNormalized = normalizeProductName(imgName);

      // 1. Correspondance exacte normalisée
      if (imgNormalized === normalizedProductName) {
        return true;
      }

      // 2. Correspondance partielle forte
      if (imgNormalized.includes(normalizedProductName) || normalizedProductName.includes(imgNormalized)) {
        return true;
      }

      // 3. Recherche par mots clés (au moins 2 mots correspondent)
      const matchingWords = productWords.filter(word => imgName.includes(word));
      if (matchingWords.length >= 2) {
        return true;
      }

      // 4. Correspondance sur les 15 premiers caractères
      if (normalizedProductName.length > 15 && imgName.includes(normalizedProductName.substring(0, 15))) {
        return true;
      }

      return false;
    });

    if (matchedImage) {
      // Ajouter transformation Cloudinary pour optimisation
      const optimizedUrl = matchedImage.secure_url.replace(
        '/upload/',
        '/upload/w_400,h_500,c_fill,f_auto,q_auto:good/'
      );

      product.image = optimizedUrl;
      product.cloudinary_public_id = matchedImage.public_id;

      matched.push({
        productName: product.name,
        brand: product.brand,
        imageName: matchedImage.public_id,
        url: optimizedUrl
      });

      // Statistiques par marque
      if (!matchStats.byBrand[product.brand]) {
        matchStats.byBrand[product.brand] = { matched: 0, total: 0 };
      }
      matchStats.byBrand[product.brand].matched++;
      matchStats.byBrand[product.brand].total++;

      console.log(`✅ [${index + 1}/${products.length}] ${product.brand} - ${product.name}`);
      console.log(`   -> ${matchedImage.public_id}`);
    } else {
      unmatched.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        currentImage: product.image
      });

      // Statistiques par marque
      if (!matchStats.byBrand[product.brand]) {
        matchStats.byBrand[product.brand] = { matched: 0, total: 0 };
      }
      matchStats.byBrand[product.brand].total++;

      console.log(`❌ [${index + 1}/${products.length}] ${product.brand} - ${product.name}`);
      console.log(`   -> PAS DE CORRESPONDANCE`);
    }
  });

  // Générer le fichier products-data.js mis à jour
  const outputContent = `// ============================================
// PRODUCTS DATA - Cloudinary Integration
// Total products: ${products.length}
// Matched: ${matched.length} | Unmatched: ${unmatched.length}
// Generated: ${new Date().toLocaleString('fr-FR')}
// ============================================

const products = ${JSON.stringify(products, null, 2)};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.products = products;
}

console.log('📦 Products loaded: ${products.length} parfums');
`;

  fs.writeFileSync('./public/js/products-data.js', outputContent, 'utf-8');

  // Générer le rapport de matching détaillé
  const report = {
    timestamp: new Date().toISOString(),
    cloudinary: {
      cloud_name: 'dzntnjtkc',
      totalImages: allCloudinaryImages.length
    },
    matching: {
      total: products.length,
      matched: matched.length,
      unmatched: unmatched.length,
      matchRate: ((matched.length / products.length) * 100).toFixed(2) + '%'
    },
    byBrand: matchStats.byBrand,
    matchedProducts: matched,
    unmatchedProducts: unmatched,
    suggestions: unmatched.map(u => ({
      product: u.name,
      brand: u.brand,
      suggestion: `Uploader une image nommée: ${normalizeProductName(u.name)}.jpg dans le dossier ${getBrandFolders(u.brand)[0]}/`
    }))
  };

  fs.writeFileSync('./cloudinary-matching-report.json', JSON.stringify(report, null, 2), 'utf-8');

  // Résumé final avec stats par marque
  console.log('\n' + '='.repeat(70));
  console.log('📊 RÉSUMÉ DU MATCHING CLOUDINARY');
  console.log('='.repeat(70));
  console.log(`\n📸 Images Cloudinary: ${allCloudinaryImages.length}`);
  console.log(`📦 Produits totaux: ${products.length}`);
  console.log(`✅ Produits matchés: ${matched.length}`);
  console.log(`❌ Produits non-matchés: ${unmatched.length}`);
  console.log(`📈 Taux de matching: ${report.matching.matchRate}`);

  console.log(`\n🏷️  STATISTIQUES PAR MARQUE:`);
  Object.keys(matchStats.byBrand).forEach(brand => {
    const stats = matchStats.byBrand[brand];
    const rate = ((stats.matched / stats.total) * 100).toFixed(1);
    console.log(`   ${brand}: ${stats.matched}/${stats.total} (${rate}%)`);
  });

  console.log(`\n📄 Rapport détaillé: ./cloudinary-matching-report.json`);
  console.log(`💾 Fichier mis à jour: ./public/js/products-data.js`);

  if (unmatched.length > 0) {
    console.log(`\n⚠️  PRODUITS NON-MATCHÉS (${unmatched.length}):`);
    console.log(`   Consultez cloudinary-matching-report.json section "suggestions"`);
    console.log(`   pour les noms de fichiers recommandés`);
  }

  console.log('='.repeat(70) + '\n');
}

matchImagesToProducts().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
