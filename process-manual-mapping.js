const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'dzntnjtkc',
  api_key: '858925468364734',
  api_secret: 'bJBCnCk5X9CTZWWyW8WAyb7P594'
});

// Charger le fichier de mapping manuel
const mappingData = JSON.parse(fs.readFileSync('./manual-image-mapping.json', 'utf-8'));

// Charger les produits
const products = require('./public/js/products-data.js');

// Fonction pour mapper les marques aux dossiers
function getBrandFolder(brand) {
  const brandMap = {
    'Lattafa': 'lattafa',
    'Maison Alhambra': 'alhambra',
    'Fragrance World': 'fragrance-world',
    'Dubai Perfumes': 'dubai-perfumes',
    'French Avenue': 'french-avenue'
  };
  return brandMap[brand] || brand.toLowerCase().replace(/\s+/g, '-');
}

async function processManualMapping() {
  console.log('🚀 Traitement du mapping manuel...\n');

  // Filtrer les images qui ont un produit sélectionné
  const validMappings = mappingData.mappings.filter(m => m.selectedProductId);

  console.log(`📸 ${validMappings.length}/${mappingData.totalImages} images mappées manuellement\n`);

  if (validMappings.length === 0) {
    console.log('❌ Aucune image mappée. Remplissez le fichier manual-image-mapping.json d\'abord.');
    return;
  }

  const uploaded = [];
  const failed = [];
  const skipped = [];

  for (let i = 0; i < validMappings.length; i++) {
    const mapping = validMappings[i];
    const product = products.find(p => p.id === mapping.selectedProductId);

    if (!product) {
      failed.push({
        imageFile: mapping.imageFile,
        error: `Produit ${mapping.selectedProductId} non trouvé`
      });
      console.log(`[${i + 1}/${validMappings.length}] ❌ ${mapping.imageFile}: Produit non trouvé`);
      continue;
    }

    // Trouver le cloudinaryName dans les suggestions
    const suggestion = mapping.suggestions.find(s => s.productId === mapping.selectedProductId);
    const cloudinaryName = suggestion ? suggestion.cloudinaryName :
      mapping.imageFile.replace(/\.[^.]+$/, '').toLowerCase().replace(/\s+/g, '-');

    const brandFolder = getBrandFolder(product.brand);
    const publicId = `${brandFolder}/${cloudinaryName}`;

    console.log(`[${i + 1}/${validMappings.length}] 📸 ${mapping.imageFile}`);
    console.log(`   → ${product.name} (${product.brand})`);
    console.log(`   📤 Upload: ${publicId}`);

    try {
      const result = await cloudinary.uploader.upload(mapping.imagePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
        folder: brandFolder,
        use_filename: false,
        unique_filename: false
      });

      uploaded.push({
        imageFile: mapping.imageFile,
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id
      });

      console.log(`   ✅ Upload réussi!`);
      console.log(`   🔗 ${result.secure_url}\n`);

    } catch (error) {
      if (error.http_code === 400 && error.message.includes('already exists')) {
        skipped.push({
          imageFile: mapping.imageFile,
          productName: product.name,
          reason: 'Déjà existant sur Cloudinary',
          publicId: publicId
        });
        console.log(`   ⚠️  Déjà existant, ignoré\n`);
      } else {
        failed.push({
          imageFile: mapping.imageFile,
          productName: product.name,
          error: error.message
        });
        console.log(`   ❌ Erreur: ${error.message}\n`);
      }
    }

    // Pause entre uploads
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Rapport
  console.log('='.repeat(70));
  console.log('📊 RAPPORT D\'UPLOAD MANUEL');
  console.log('='.repeat(70));
  console.log(`\n📤 Uploadés: ${uploaded.length}`);
  console.log(`⚠️  Ignorés (déjà existants): ${skipped.length}`);
  console.log(`❌ Échecs: ${failed.length}`);

  const report = {
    timestamp: new Date().toISOString(),
    totalMapped: validMappings.length,
    uploaded: uploaded.length,
    skipped: skipped.length,
    failed: failed.length,
    details: { uploaded, skipped, failed }
  };

  fs.writeFileSync('./manual-upload-report.json', JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 Rapport: ./manual-upload-report.json`);

  // Lancer le matching automatique
  if (uploaded.length > 0) {
    console.log('\n🔄 Lancement du matching Cloudinary...\n');
    const { execSync } = require('child_process');
    try {
      execSync('node cloudinary-image-matcher.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Erreur matching:', error.message);
    }
  }

  console.log('='.repeat(70) + '\n');
}

processManualMapping().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
