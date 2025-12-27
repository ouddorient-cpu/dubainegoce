// Import products from part1 (1).csv
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'part1 (1).csv');
const content = fs.readFileSync(csvPath, 'utf-8');

console.log('🔍 Processing part1 (1).csv...\n');

// Parse CSV
const lines = content.split('\n');
const products = [];
const seen = new Set();

// CSV structure from the file
// ID,Type,UGS,GTIN,Nom,Publié,Mis en avant,Visibilité,Description courte,Description,etc...
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Split by comma, but respect quoted fields
  const fields = [];
  let currentField = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField);

  // Extract product data
  const id = fields[0]?.trim();
  const nom = fields[4]?.trim();
  const descriptionCourte = fields[8]?.trim() || '';
  const descriptionLongue = fields[9]?.trim() || '';
  const price = parseFloat(fields[26]) || parseFloat(fields[27]) || 35;
  const imagesField = fields[30]?.trim() || '';
  const ean = fields[38]?.trim() || '';

  // Skip if no ID or name
  if (!id || !nom || nom.length < 3) continue;
  if (seen.has(id)) continue;
  seen.add(id);

  // Extract image URLs
  const imageRegex = /(https:\/\/[^\s,"]+\.(?:jpg|jpeg|png|webp))/gi;
  const images = imagesField.match(imageRegex) || [];
  if (images.length === 0) continue; // Skip products without images

  // Determine brand
  let brand = 'Dubai Perfumes';
  const nomLower = nom.toLowerCase();
  const descLower = (descriptionCourte + ' ' + descriptionLongue).toLowerCase();

  if (nomLower.includes('lattafa') || descLower.includes('lattafa')) {
    brand = 'Lattafa';
  } else if (nomLower.includes('alhambra') || descLower.includes('alhambra')) {
    brand = 'Maison Alhambra';
  } else if (nomLower.includes('fragrance world') || descLower.includes('fragrance world')) {
    brand = 'Fragrance World';
  } else if (nomLower.includes('armaf') || descLower.includes('armaf')) {
    brand = 'Armaf';
  } else if (nomLower.includes('paris corner') || descLower.includes('paris corner')) {
    brand = 'Paris Corner';
  } else if (nomLower.includes('afnan') || descLower.includes('afnan')) {
    brand = 'Afnan';
  } else if (nomLower.includes('jean lowe') || descLower.includes('jean lowe')) {
    brand = 'Jean Lowe';
  }

  // Determine gender
  let gender = 'mixte';
  const searchText = (nom + ' ' + descriptionCourte).toLowerCase();

  if ((searchText.includes('homme') || searchText.includes('men') || searchText.includes('pour homme')) &&
      !searchText.includes('femme') && !searchText.includes('women')) {
    gender = 'homme';
  } else if ((searchText.includes('femme') || searchText.includes('women') || searchText.includes('her') ||
             searchText.includes('pour femme')) &&
             !searchText.includes('homme') && !searchText.includes('men')) {
    gender = 'femme';
  }

  // Clean description - remove HTML tags and excessive formatting
  let description = descriptionCourte || descriptionLongue || `Parfum ${brand} authentique de Dubaï. Fragrance de haute qualité avec une excellente tenue.`;
  description = description
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300); // Limit length

  // If description is still too short, use a default
  if (description.length < 30) {
    description = `${nom} - Parfum ${brand} authentique de Dubaï. Fragrance de haute qualité avec une excellente tenue.`;
  }

  const product = {
    id: `prod-${id}`,
    name: nom,
    brand: brand,
    price: price,
    image: images[0], // Primary image
    description: description,
    gender: gender,
    rating: parseFloat((4.0 + Math.random()).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 15,
    inStock: true,
    bestseller: Math.random() > 0.82,
    nouveau: Math.random() > 0.88,
    categories: [brand, gender.charAt(0).toUpperCase() + gender.slice(1)]
  };

  products.push(product);
}

console.log(`\n✅ Extracted ${products.length} products successfully!\n`);

// Statistics
const brandStats = {};
const genderStats = { homme: 0, femme: 0, mixte: 0 };
const priceRange = { min: Infinity, max: 0, avg: 0 };

products.forEach(p => {
  brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
  genderStats[p.gender]++;
  priceRange.min = Math.min(priceRange.min, p.price);
  priceRange.max = Math.max(priceRange.max, p.price);
  priceRange.avg += p.price;
});
priceRange.avg = (priceRange.avg / products.length).toFixed(2);

console.log('📦 Brands:', brandStats);
console.log('🎯 Gender:', genderStats);
console.log('💰 Price Range:', `${priceRange.min}€ - ${priceRange.max}€ (avg: ${priceRange.avg}€)`);
console.log(`⭐ Bestsellers: ${products.filter(p => p.bestseller).length}`);
console.log(`🆕 New: ${products.filter(p => p.nouveau).length}`);

// Load existing products
const productsDataPath = path.join(__dirname, 'public', 'js', 'products-data.js');
let existingProducts = [];

if (fs.existsSync(productsDataPath)) {
  try {
    const existingContent = fs.readFileSync(productsDataPath, 'utf-8');
    const match = existingContent.match(/const products = (\[[\s\S]*?\]);/);
    if (match) {
      existingProducts = JSON.parse(match[1]);
      console.log(`\n📚 Found ${existingProducts.length} existing products`);
    }
  } catch (err) {
    console.log('⚠️ Could not load existing products, will create new file');
  }
}

// Merge products (avoid duplicates)
const existingIds = new Set(existingProducts.map(p => p.id));
const newProducts = products.filter(p => !existingIds.has(p.id));
const allProducts = [...existingProducts, ...newProducts];

console.log(`\n➕ Adding ${newProducts.length} new products`);
console.log(`📊 Total products: ${allProducts.length}`);

// Save to file
const jsContent = `// ==============================================
// DUBAINEGOCE - PRODUCTS DATABASE
// ==============================================
// Total Products: ${allProducts.length}
// Generated: ${new Date().toLocaleString('fr-FR')}
// Source: WooCommerce CSV Export
// ==============================================

const products = ${JSON.stringify(allProducts, null, 2)};

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}

// Browser global
if (typeof window !== 'undefined') {
  window.products = products;
}

console.log('📦 DubaiNegoce - ${allProducts.length} parfums chargés');
`;

fs.writeFileSync(productsDataPath, jsContent, 'utf-8');
const fileSize = (fs.statSync(productsDataPath).size / 1024).toFixed(2);

console.log(`\n📝 Updated: ${productsDataPath}`);
console.log(`💾 File size: ${fileSize} KB`);

// Display sample of new products
console.log(`\n📋 New Products Added (first 10):\n`);
newProducts.slice(0, 10).forEach((p, i) => {
  const badges = [];
  if (p.bestseller) badges.push('⭐');
  if (p.nouveau) badges.push('🆕');
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   💎 ${p.brand} | 👤 ${p.gender} | 💰 ${p.price}€`);
  console.log(`   ⭐ ${p.rating}/5 (${p.reviews} avis) ${badges.join(' ')}`);
  console.log('');
});

console.log('✨ Import complete! All products are now available.\n');
