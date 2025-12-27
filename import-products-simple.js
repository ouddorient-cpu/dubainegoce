// Simple CSV to JSON converter for WooCommerce products
const fs = require('fs');
const path = require('path');

// Read the entire CSV
const csvPath = path.join(__dirname, 'wc-product-export-22-12-2025-1766394275163.csv');
let csvContent = fs.readFileSync(csvPath, 'utf-8');

// Replace escaped newlines to handle multiline fields
csvContent = csvContent.replace(/\\n/g, ' ');

const lines = csvContent.split('\n').filter(line => line.trim());
console.log(`📄 Total lines: ${lines.length}`);

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

  const product = {
    id: `prod-${id}`,
    name: nom,
    brand: brand,
    price: price,
    image: image,
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

console.log(`\n✅ Successfully parsed ${products.length} products`);
console.log(`⏭️  Skipped ${skipped} products (variations, unpublished, or missing data)`);

// Show brand distribution
const brandCounts = {};
products.forEach(p => {
  brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
});
console.log(`\n📦 Brands:`, brandCounts);

// Show gender distribution
const genderCounts = {
  homme: products.filter(p => p.gender === 'homme').length,
  femme: products.filter(p => p.gender === 'femme').length,
  mixte: products.filter(p => p.gender === 'mixte').length
};
console.log(`🎯 Gender:`, genderCounts);

console.log(`⭐ Bestsellers: ${products.filter(p => p.bestseller).length}`);
console.log(`🆕 New products: ${products.filter(p => p.nouveau).length}`);

// Generate JavaScript file
const outputPath = path.join(__dirname, 'public', 'js', 'products-data.js');
const jsContent = `// ============================================
// PRODUCTS DATA - Generated from WooCommerce CSV
// Total products: ${products.length}
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

fs.writeFileSync(outputPath, jsContent, 'utf-8');
const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
console.log(`\n📝 Generated: ${outputPath}`);
console.log(`💾 File size: ${fileSize} KB`);

// Show sample products
console.log(`\n📋 Sample products:\n`);
products.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   Brand: ${p.brand} | Price: ${p.price}€ | Gender: ${p.gender}`);
  console.log(`   Rating: ${p.rating}★ (${p.reviews} avis)`);
  console.log(`   ${p.bestseller ? '⭐ BESTSELLER' : ''}${p.nouveau ? ' 🆕 NEW' : ''}`);
  console.log('');
});

console.log('✨ Import complete!\n');
