// Import all parts - CSV to JSON converter for WooCommerce products
const fs = require('fs');
const path = require('path');

// Liste des fichiers CSV à importer
const csvFiles = [
  'part1 (1).csv',
  'part2 (1).csv',
  'part3.csv',
  'part4.csv'
];

// Fonction pour parser un fichier CSV
function parseCSVFile(csvPath) {
  console.log(`\n📄 Traitement de ${path.basename(csvPath)}...`);

  let csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Replace escaped newlines to handle multiline fields
  csvContent = csvContent.replace(/\\n/g, ' ');

  const lines = csvContent.split('\n').filter(line => line.trim());
  console.log(`   Total lignes: ${lines.length}`);

  const products = [];
  let skipped = 0;

  // Process each line (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Use regex to split CSV while respecting quoted fields
    const fields = [];
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
    const parts = line.split(regex);

    // Clean each field
    parts.forEach(part => {
      fields.push(part.replace(/^"|"$/g, '').trim());
    });

    // Extract fields by index (based on CSV structure)
    const id = fields[0];
    const type = fields[1];
    const nom = fields[4];
    const publie = fields[5];
    const descriptionCourte = fields[8];
    const tarif = fields[26];
    const categories = fields[27];
    const image = fields[30];
    const enStock = fields[14];

    // Skip if not a simple product or not published
    if (type !== 'simple' || publie !== '1' || !nom) {
      skipped++;
      continue;
    }

    // Extract brand from name or categories
    let brand = 'Dubai Perfumes';
    const nameLower = nom.toLowerCase();
    const catLower = (categories || '').toLowerCase();

    if (nameLower.includes('lattafa') || catLower.includes('lattafa')) brand = 'Lattafa';
    else if (nameLower.includes('alhambra') || catLower.includes('alhambra')) brand = 'Maison Alhambra';
    else if (nameLower.includes('fragrance world') || catLower.includes('fragrance')) brand = 'Fragrance World';
    else if (nameLower.includes('armaf') || catLower.includes('armaf')) brand = 'Armaf';
    else if (nameLower.includes('french avenue') || catLower.includes('frenchavenue')) brand = 'French Avenue';
    else if (nameLower.includes('francique')) brand = 'French Avenue';

    // Determine gender
    let gender = 'mixte';
    if (catLower.includes('homme') && !catLower.includes('femme')) gender = 'homme';
    else if (catLower.includes('femme') && !catLower.includes('homme')) gender = 'femme';

    // Clean description
    let description = (descriptionCourte || '').replace(/<[^>]*>/g, '').trim();
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    if (!description) {
      description = `Parfum ${brand} de qualité supérieure, importé directement de Dubaï.`;
    }

    // Extract price
    let price = 35;
    if (tarif && !isNaN(parseFloat(tarif))) {
      price = parseFloat(tarif);
    }

    // Only add products with images
    if (!image || image === '') {
      skipped++;
      continue;
    }

    // Extract only the first image if multiple
    const firstImage = image.split(',')[0].trim();

    const product = {
      id: `prod-${id}`,
      name: nom,
      brand: brand,
      price: price,
      image: firstImage,
      description: description,
      gender: gender,
      rating: (4 + Math.random() * 0.9).toFixed(1), // 4.0 to 4.9
      reviews: Math.floor(Math.random() * 180) + 20, // 20-200 reviews
      inStock: enStock === '1',
      bestseller: Math.random() > 0.85,
      nouveau: Math.random() > 0.88,
      categories: (categories || '').split('>').map(c => c.trim()).filter(c => c && c.length > 0)
    };

    products.push(product);
  }

  console.log(`   ✅ ${products.length} produits extraits`);
  console.log(`   ⏭️  ${skipped} produits ignorés`);

  return products;
}

// Parse all CSV files
console.log('🚀 Démarrage de l\'importation des parfums...\n');

let allProducts = [];

csvFiles.forEach(csvFile => {
  const csvPath = path.join(__dirname, csvFile);

  if (fs.existsSync(csvPath)) {
    const products = parseCSVFile(csvPath);
    allProducts = allProducts.concat(products);
  } else {
    console.log(`⚠️  Fichier non trouvé: ${csvFile}`);
  }
});

console.log(`\n📦 TOTAL: ${allProducts.length} produits importés\n`);

// Remove duplicates based on product ID
const uniqueProducts = [];
const seenIds = new Set();

allProducts.forEach(product => {
  if (!seenIds.has(product.id)) {
    seenIds.add(product.id);
    uniqueProducts.push(product);
  }
});

console.log(`🔄 Après dédoublonnage: ${uniqueProducts.length} produits uniques\n`);

// Show brand distribution
const brandCounts = {};
uniqueProducts.forEach(p => {
  brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
});
console.log(`📦 Distribution par marque:`, brandCounts);

// Show gender distribution
const genderCounts = {
  homme: uniqueProducts.filter(p => p.gender === 'homme').length,
  femme: uniqueProducts.filter(p => p.gender === 'femme').length,
  mixte: uniqueProducts.filter(p => p.gender === 'mixte').length
};
console.log(`🎯 Distribution par genre:`, genderCounts);

console.log(`⭐ Bestsellers: ${uniqueProducts.filter(p => p.bestseller).length}`);
console.log(`🆕 Nouveaux produits: ${uniqueProducts.filter(p => p.nouveau).length}`);

// Generate JavaScript file
const outputPath = path.join(__dirname, 'public', 'js', 'products-data.js');
const jsContent = `// ============================================
// PRODUCTS DATA - Generated from WooCommerce CSV
// Total products: ${uniqueProducts.length}
// Generated: ${new Date().toLocaleString('fr-FR')}
// ============================================

const products = ${JSON.stringify(uniqueProducts, null, 2)};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.products = products;
}

console.log('📦 Products loaded: ${uniqueProducts.length} parfums');
`;

fs.writeFileSync(outputPath, jsContent, 'utf-8');
const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
console.log(`\n📝 Fichier généré: ${outputPath}`);
console.log(`💾 Taille du fichier: ${fileSize} KB`);

// Show sample products from each brand
console.log(`\n📋 Échantillon de produits par marque:\n`);

const brandSamples = {};
uniqueProducts.forEach(p => {
  if (!brandSamples[p.brand]) {
    brandSamples[p.brand] = [];
  }
  if (brandSamples[p.brand].length < 3) {
    brandSamples[p.brand].push(p);
  }
});

Object.keys(brandSamples).forEach(brand => {
  console.log(`\n🏷️  ${brand}:`);
  brandSamples[brand].forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.name}`);
    console.log(`      Prix: ${p.price}€ | Genre: ${p.gender} | Stock: ${p.inStock ? '✓' : '✗'}`);
  });
});

console.log('\n✨ Importation terminée avec succès!\n');
