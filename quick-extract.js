const fs = require('fs');
const lines = fs.readFileSync('wc-product-export-22-12-2025-1766394275163.csv', 'utf-8').split('\n');
const products = [];

for (const line of lines) {
  if (!line.match(/^(17|18|19|20)/)) continue;

  const parts = line.split(',');
  const id = parts[0];
  if (!id || parts[1] !== 'simple') continue;

  const nameMatch = line.match(/,"([^"]+)",1,/);
  if (!nameMatch) continue;
  const nom = nameMatch[1];

  const imageMatch = line.match(/(https:\/\/[^\s,"]+\.(?:jpg|jpeg|png|webp))/i);
  if (!imageMatch) continue;
  const image = imageMatch[1];

  let brand = 'Dubai Perfumes';
  const n = nom.toLowerCase();
  if (n.includes('lattafa')) brand = 'Lattafa';
  else if (n.includes('alhambra')) brand = 'Maison Alhambra';
  else if (n.includes('fragrance')) brand = 'Fragrance World';
  else if (n.includes('armaf')) brand = 'Armaf';
  else if (n.includes('afnan')) brand = 'Afnan';

  let gender = 'mixte';
  if (n.includes('homme') && !n.includes('femme')) gender = 'homme';
  else if (n.includes('femme') && !n.includes('homme')) gender = 'femme';

  products.push({
    id: 'prod-' + id,
    name: nom,
    brand: brand,
    price: 35,
    image: image,
    description: 'Parfum ' + brand + ' de qualité supérieure, importé de Dubaï.',
    gender: gender,
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 20,
    inStock: true,
    bestseller: Math.random() > 0.85,
    nouveau: Math.random() > 0.90,
    categories: [brand, gender]
  });
}

const brandStats = {};
products.forEach(p => brandStats[p.brand] = (brandStats[p.brand] || 0) + 1);
console.log('Brands:', brandStats);
console.log('Total:', products.length);

const output = 'const products = ' + JSON.stringify(products, null, 2) + ';\nif (typeof module !== "undefined") module.exports = products;\nif (typeof window !== "undefined") window.products = products;\nconsole.log("📦 ' + products.length + ' parfums chargés");';
fs.writeFileSync('public/js/products-data.js', output);
console.log('✅ File written:', (fs.statSync('public/js/products-data.js').size / 1024).toFixed(2), 'KB');
