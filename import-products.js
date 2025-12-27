// Script to import products from WooCommerce CSV export
const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, 'wc-product-export-22-12-2025-1766394275163.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser for this specific format)
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Find column indices
const getColumnIndex = (name) => {
  return headers.findIndex(h => h.includes(name));
};

const idIndex = 0;
const nameIndex = getColumnIndex('Nom');
const priceIndex = getColumnIndex('Tarif régulier');
const descriptionIndex = getColumnIndex('Description courte');
const imageIndex = getColumnIndex('Images');
const categoriesIndex = getColumnIndex('Catégories');
const publishedIndex = getColumnIndex('Publié');
const stockIndex = getColumnIndex('En stock');
const brandIndex = headers.length - 1; // Marques is the last column

console.log('📊 Column indices:', {
  id: idIndex,
  name: nameIndex,
  price: priceIndex,
  description: descriptionIndex,
  image: imageIndex,
  categories: categoriesIndex,
  published: publishedIndex,
  stock: stockIndex,
  brand: brandIndex
});

const products = [];

// Parse each line (skip header)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Split by comma, but respect quoted fields
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  // Extract product data
  const id = fields[idIndex];
  const name = fields[nameIndex]?.replace(/"/g, '') || '';
  const price = fields[priceIndex] || '35';
  const description = fields[descriptionIndex]?.replace(/"/g, '').replace(/<[^>]*>/g, '').substring(0, 200) || '';
  const image = fields[imageIndex]?.replace(/"/g, '') || '';
  const categories = fields[categoriesIndex]?.replace(/"/g, '') || '';
  const published = fields[publishedIndex] === '1';
  const inStock = fields[stockIndex] === '1';

  // Extract brand from categories or use a default
  let brand = 'Lattafa';
  if (categories.includes('LATTAFA')) brand = 'Lattafa';
  else if (categories.includes('ALHAMBRA')) brand = 'Maison Alhambra';
  else if (categories.includes('FRAGRANCE WORLD')) brand = 'Fragrance World';
  else if (categories.includes('ARMAF')) brand = 'Armaf';

  // Determine gender from categories
  let gender = 'mixte';
  if (categories.includes('HOMME')) gender = 'homme';
  else if (categories.includes('FEMME')) gender = 'femme';
  else if (categories.includes('MIXTE')) gender = 'mixte';

  // Only add published and in-stock products with valid names and images
  if (published && inStock && name && image) {
    const product = {
      id: `prod-${id}`,
      name: name,
      brand: brand,
      price: parseFloat(price) || 35,
      image: image,
      description: description || `Parfum ${brand} de qualité supérieure`,
      gender: gender,
      rating: 4 + Math.random(), // Random rating between 4 and 5
      reviews: Math.floor(Math.random() * 200) + 10, // Random reviews 10-210
      inStock: true,
      bestseller: Math.random() > 0.85, // 15% are bestsellers
      nouveau: Math.random() > 0.90, // 10% are new
      categories: categories.split('>').map(c => c.trim()).filter(c => c)
    };

    products.push(product);
  }
}

console.log(`\n✅ Parsed ${products.length} products from CSV`);
console.log(`📦 Brands found:`, [...new Set(products.map(p => p.brand))]);
console.log(`🎯 Gender distribution:`, {
  homme: products.filter(p => p.gender === 'homme').length,
  femme: products.filter(p => p.gender === 'femme').length,
  mixte: products.filter(p => p.gender === 'mixte').length
});
console.log(`⭐ Bestsellers:`, products.filter(p => p.bestseller).length);
console.log(`🆕 New products:`, products.filter(p => p.nouveau).length);

// Generate products-data.js file
const outputPath = path.join(__dirname, 'public', 'js', 'products-data.js');
const jsContent = `// ============================================
// PRODUCTS DATA - Auto-generated from CSV
// Total products: ${products.length}
// Generated: ${new Date().toISOString()}
// ============================================

const products = ${JSON.stringify(products, null, 2)};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.products = products;
}

console.log('📦 Loaded ${products.length} products');
`;

fs.writeFileSync(outputPath, jsContent, 'utf-8');
console.log(`\n✅ Generated ${outputPath}`);
console.log(`📝 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

// Show sample products
console.log('\n📋 Sample products:');
products.slice(0, 3).forEach(p => {
  console.log(`  - ${p.name} (${p.brand}) - ${p.price}€`);
});

console.log('\n✨ Import complete!');
