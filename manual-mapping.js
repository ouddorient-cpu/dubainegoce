const fs = require('fs');
const path = require('path');

// Dossier contenant les images
const imagesFolder = 'C:\\Users\\abder\\OneDrive\\Bureau\\SITES PERSO\\images avec fond gris\\Nouveau dossier';

// Charger les produits
const products = require('./public/js/products-data.js');

// Fonction de normalisation
function normalizeForMatching(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour créer un nom de fichier Cloudinary
function createCloudinaryFilename(productName, brand) {
  const cleanName = productName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\d+\s*ml/gi, '')
    .replace(/eau\s*de\s*parfum/gi, '')
    .replace(/–/g, '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const cleanBrand = brand
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  return `${cleanName}-${cleanBrand}`;
}

// Lire tous les fichiers du dossier
const files = fs.readdirSync(imagesFolder);
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
});

console.log(`📸 ${imageFiles.length} images trouvées`);
console.log(`📦 ${products.length} produits dans la base\n`);

// Créer une map image -> meilleurs produits possibles
const mappingSuggestions = [];

imageFiles.forEach((filename, index) => {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  const normalized = normalizeForMatching(nameWithoutExt);
  const keywords = normalized.split(' ').filter(word => word.length > 3);

  // Trouver les 3 meilleurs matches
  const matches = [];

  products.forEach(product => {
    const productNormalized = normalizeForMatching(product.name);
    const productWords = productNormalized.split(' ').filter(word => word.length > 3);

    let score = 0;

    // Correspondance exacte
    if (productNormalized === normalized) {
      score = 1000;
    } else {
      // Compter les mots en commun
      const matchingWords = keywords.filter(word => productWords.includes(word));
      score = matchingWords.length;

      // Bonus si le nom de fichier contient le nom du produit
      if (normalized.includes(productNormalized) || productNormalized.includes(normalized)) {
        score += 5;
      }

      // Bonus pour correspondance partielle de marque
      const brandNormalized = normalizeForMatching(product.brand);
      if (normalized.includes(brandNormalized)) {
        score += 2;
      }
    }

    if (score > 0) {
      matches.push({
        product,
        score,
        cloudinaryName: createCloudinaryFilename(product.name, product.brand)
      });
    }
  });

  // Trier par score décroissant
  matches.sort((a, b) => b.score - a.score);

  mappingSuggestions.push({
    index: index + 1,
    filename,
    topMatches: matches.slice(0, 3)
  });
});

// Générer fichier de mapping manuel
const mappingFile = {
  instructions: [
    "Pour chaque image, choisissez le bon produit parmi les suggestions",
    "Modifiez le champ 'selectedProductId' avec l'ID du produit correct",
    "Si aucune suggestion n'est correcte, laissez null",
    "Format: mettre l'ID du produit (ex: 'prod-1794')",
    "",
    "Une fois terminé, lancez: node process-manual-mapping.js"
  ],
  totalImages: imageFiles.length,
  totalProducts: products.length,
  mappings: mappingSuggestions.map(item => ({
    imageFile: item.filename,
    imagePath: path.join(imagesFolder, item.filename),
    selectedProductId: null, // À REMPLIR MANUELLEMENT
    suggestions: item.topMatches.map(m => ({
      productId: m.product.id,
      productName: m.product.name,
      brand: m.product.brand,
      score: m.score,
      cloudinaryName: m.cloudinaryName
    }))
  }))
};

fs.writeFileSync('./manual-image-mapping.json', JSON.stringify(mappingFile, null, 2), 'utf-8');

console.log('✅ Fichier de mapping créé: manual-image-mapping.json');
console.log('\n📝 INSTRUCTIONS:');
console.log('1. Ouvrez manual-image-mapping.json');
console.log('2. Pour chaque image, vérifiez les suggestions');
console.log('3. Remplissez le champ "selectedProductId" avec le bon ID produit');
console.log('4. Lancez: node process-manual-mapping.js');
console.log('\n⚠️  Astuce: Les suggestions avec score > 5 sont généralement bonnes');

// Afficher quelques exemples
console.log('\n📋 EXEMPLES DE MAPPING À FAIRE:');
mappingSuggestions.slice(0, 5).forEach(item => {
  console.log(`\n📸 ${item.filename}:`);
  if (item.topMatches.length > 0) {
    item.topMatches.slice(0, 2).forEach(match => {
      console.log(`   ${match.score > 5 ? '✅' : '⚠️ '} [Score: ${match.score}] ${match.product.name} (${match.product.brand})`);
    });
  } else {
    console.log('   ❌ Aucune suggestion automatique');
  }
});
