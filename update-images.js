// Script pour mettre à jour les images des produits avec les vraies URLs
const fs = require('fs');
const path = require('path');

// Mapping des produits avec leurs vraies images depuis le CSV
const imageMapping = {
  "Khamrah": "https://www.frenchavenue.fr/wp-content/uploads/2024/01/Khamrah.jpeg",
  "Fakhar Black": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/fakhar-silver-lattafa-eau-de-parfum-mixte-jpg.webp",
  "Raghba": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/1000029948-1-jpg.webp",
  "Yara": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/Yara-eau-de-parfum-lattafa-600x600-1-jpg.webp",
  "Asad": "https://www.frenchavenue.fr/wp-content/uploads/2024/01/lattafa-parfum-asad.jpg",
  "Ramz Silver": "https://www.frenchavenue.fr/wp-content/uploads/2024/01/pdt2_7_2_2_1_700x700_auc6291106066722_rw_eau-de-parfum-ramz-lattafa-silver-by-lattafa-100ml-1.jpg",
  "Ramz Gold": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/ramz-lattafa-eau-de-parfum-jpg.webp",
  "Confidential Platinum": "https://www.frenchavenue.fr/wp-content/uploads/2024/01/Confidential-Platinum.jpg",
  "Qaa'ed": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/qaaed-2-1-jpg.webp",
  "Ana Abiyedh Rouge": "https://www.frenchavenue.fr/wp-content/uploads/2024/01/Capture-decran-2024-03-19-061849.png",
  "Fakhar Rose Gold": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/1000029827-jpg.webp",
  "Ejaazi": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/1000029282-1-jpg.webp",
  "Maahir": "https://www.frenchavenue.fr/wp-content/uploads/2023/12/Maahir-Lattafa-1-jpeg.webp",
  "Yara Candy": "https://www.frenchavenue.fr/wp-content/uploads/2025/05/IMG-20250527-WA0038.jpg",
  "Yara Blanc": "https://www.frenchavenue.fr/wp-content/uploads/2025/05/IMG-20250527-WA0035.jpg",
  "Yara Orange": "https://www.frenchavenue.fr/wp-content/uploads/2025/05/IMG-20250527-WA0037.jpg",
  "Ana Abiyedh Poudrée": "https://www.frenchavenue.fr/wp-content/uploads/2025/05/IMG-20250527-WA0030.jpg"
};

// Lire le fichier products-data.js
const productsFile = path.join(__dirname, 'public', 'js', 'products-data.js');
let content = fs.readFileSync(productsFile, 'utf8');

// Remplacer les URLs Cloudinary par les vraies URLs
Object.keys(imageMapping).forEach(productName => {
  const realUrl = imageMapping[productName];
  // Chercher toutes les occurrences de ce produit et remplacer l'URL
  const regex = new RegExp(`(name:\\s*"${productName}"[\\s\\S]*?image:\\s*")[^"]+(")`,'g');
  content = content.replace(regex, `$1${realUrl}$2`);
});

// Sauvegarder le fichier modifié
fs.writeFileSync(productsFile, content, 'utf8');

console.log('✅ Images des produits mises à jour avec succès!');
console.log(`📦 ${Object.keys(imageMapping).length} produits traités`);
