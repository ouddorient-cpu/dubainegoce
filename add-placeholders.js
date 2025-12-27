const fs = require('fs');
const products = require('./public/js/products-data.js');

// Remplacer toutes les URLs non-Cloudinary par un placeholder
const placeholderUrl = 'https://res.cloudinary.com/dzntnjtkc/image/upload/v1/placeholder-perfume.jpg';

let replaced = 0;
products.forEach(product => {
  if (!product.image || !product.image.includes('cloudinary.com/dzntnjtkc')) {
    product.image = placeholderUrl;
    replaced++;
  }
});

const cloudinaryCount = products.filter(p => p.image.includes('cloudinary.com/dzntnjtkc') && !p.image.includes('placeholder')).length;
const placeholderCount = products.filter(p => p.image.includes('placeholder')).length;

const outputContent = `// ============================================
// PRODUCTS DATA - Cloudinary Integration
// Total products: ${products.length}
// With Cloudinary images: ${cloudinaryCount}
// With placeholder: ${placeholderCount}
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
console.log('✅ Fichier products-data.js mis à jour');
console.log(`📸 Images Cloudinary réelles: ${cloudinaryCount}`);
console.log(`🖼️  Images placeholder: ${placeholderCount}`);
console.log(`🔄 Total remplacés: ${replaced}`);
