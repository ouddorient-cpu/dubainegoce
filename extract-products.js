// Extract products from CSV using a different approach
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'wc-product-export-22-12-2025-1766394275163.csv');
const content = fs.readFileSync(csvPath, 'utf-8');

// Split into lines but preserve the structure
const allLines = content.split('\n');
console.log(`Total lines in file: ${allLines.length}`);

// Get header to understand structure
const header = allLines[0];
const columns = header.match(/([^,]+|"[^"]*")/g);
console.log(`\nColumns found: ${columns.length}`);
console.log('Looking for: ID, Nom, Tarif régulier, Images, Catégories, Publié');

// Find indices
const idIdx = columns.findIndex(c => c === 'ID');
const nomIdx = columns.findIndex(c => c === 'Nom');
const prixIdx = columns.findIndex(c => c.includes('Tarif régulier'));
const imageIdx = columns.findIndex(c => c === 'Images');
const catIdx = columns.findIndex(c => c.includes('Catégories'));
const publieIdx = columns.findIndex(c => c.includes('Publié'));

console.log('\nColumn indices:', { idIdx, nomIdx, prixIdx, imageIdx, catIdx, publieIdx });

const products = [];

// Extract using a more robust method - look for pattern: ID,simple,...
const productPattern = /^(\d+),simple,[\s\S]*?"([^"]+)"[^,]*,1,0,visible/gm;
let match;

while ((match = productPattern.exec(content)) !== null) {
  const id = match[1];
  const nom = match[2];

  // Find the image URL for this product
  const imagePattern = new RegExp(`${id},simple[\\s\\S]*?(https?://[^\\s,)"]+\\.(?:jpg|jpeg|png|webp))`, 'i');
  const imageMatch = content.match(imagePattern);
  const image = imageMatch ? imageMatch[1] : '';

  if (!image) continue;

  // Extract brand from name
  let brand = 'Dubai Perfumes';
  const nomLower = nom.toLowerCase();
  if (nomLower.includes('lattafa')) brand = 'Lattafa';
  else if (nomLower.includes('alhambra')) brand = 'Maison Alhambra';
  else if (nomLower.includes('fragrance world')) brand = 'Fragrance World';
  else if (nomLower.includes('armaf')) brand = 'Armaf';

  // Determine gender from name
  let gender = 'mixte';
  if (nomLower.includes(' homme') || nomLower.includes('- homme')) gender = 'homme';
  else if (nomLower.includes(' femme') || nomLower.includes('- femme')) gender = 'femme';
  else if (nomLower.includes('mixte')) gender = 'mixte';

  products.push({
    id: `prod-${id}`,
    name: nom,
    brand: brand,
    price: 35,
    image: image,
    description: `Parfum ${brand} authentique de Dubaï. Fragrance de qualité supérieure.`,
    gender: gender,
    rating: (4.2 + Math.random() * 0.7).toFixed(1),
    reviews: Math.floor(Math.random() * 150) + 30,
    inStock: true,
    bestseller: Math.random() > 0.87,
    nouveau: Math.random() > 0.90,
    categories: [brand, gender.charAt(0).toUpperCase() + gender.slice(1)]
  });
}

console.log(`\n✅ Extracted ${products.length} products`);

// Brand stats
const brandStats = {};
products.forEach(p => {
  brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
});
console.log('\n📦 Brands:', brandStats);

// Gender stats
console.log('🎯 Gender:', {
  homme: products.filter(p => p.gender === 'homme').length,
  femme: products.filter(p => p.gender === 'femme').length,
  mixte: products.filter(p => p.gender === 'mixte').length
});

// Write to file
const outputPath = path.join(__dirname, 'public', 'js', 'products-data.js');
const jsContent = `// Products Database - ${products.length} products
// Generated: ${new Date().toLocaleString('fr-FR')}

const products = ${JSON.stringify(products, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}

if (typeof window !== 'undefined') {
  window.products = products;
}

console.log('📦 ${products.length} parfums chargés');
`;

fs.writeFileSync(outputPath, jsContent, 'utf-8');
console.log(`\n📝 File written: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

// Sample
console.log('\n📋 Samples:');
products.slice(0, 5).forEach(p => {
  console.log(`  - ${p.name} (${p.brand})`);
});

console.log('\n✨ Done!\n');
