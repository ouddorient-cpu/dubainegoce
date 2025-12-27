const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'dzntnjtkc',
  api_key: '858925468364734',
  api_secret: 'bJBCnCk5X9CTZWWyW8WAyb7P594'
});

// Dossier contenant les images
const imagesFolder = 'C:\\Users\\abder\\OneDrive\\Bureau\\SITES PERSO\\images avec fond gris\\Nouveau dossier';

async function bulkUploadToCloudinary() {
  console.log('🚀 Upload en masse vers Cloudinary...\n');
  console.log(`📁 Source: ${imagesFolder}\n`);

  if (!fs.existsSync(imagesFolder)) {
    console.error(`❌ Le dossier n'existe pas: ${imagesFolder}`);
    return;
  }

  // Lire tous les fichiers
  const files = fs.readdirSync(imagesFolder);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`📸 ${imageFiles.length} images trouvées\n`);
  console.log('📤 Début de l\'upload...\n');

  const uploaded = [];
  const skipped = [];
  const failed = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    const filePath = path.join(imagesFolder, filename);
    const nameWithoutExt = path.basename(filename, path.extname(filename));

    // Créer un public_id propre (sans extension)
    const publicId = `temp-uploads/${nameWithoutExt}`;

    console.log(`[${i + 1}/${imageFiles.length}] ${filename}`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
        folder: 'temp-uploads',
        use_filename: true,
        unique_filename: false
      });

      uploaded.push({
        original: filename,
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id
      });

      console.log(`   ✅ Uploadé: ${result.public_id}`);

    } catch (error) {
      if (error.http_code === 400 && error.message.includes('already exists')) {
        skipped.push({
          original: filename,
          publicId: publicId
        });
        console.log(`   ⚠️  Déjà existant, ignoré`);
      } else {
        failed.push({
          original: filename,
          error: error.message
        });
        console.log(`   ❌ Erreur: ${error.message}`);
      }
    }

    // Pause entre uploads
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Rapport
  console.log('\n' + '='.repeat(70));
  console.log('📊 RAPPORT D\'UPLOAD EN MASSE');
  console.log('='.repeat(70));
  console.log(`\n✅ Uploadés: ${uploaded.length}`);
  console.log(`⚠️  Ignorés: ${skipped.length}`);
  console.log(`❌ Échecs: ${failed.length}`);

  const report = {
    timestamp: new Date().toISOString(),
    folder: imagesFolder,
    totalImages: imageFiles.length,
    uploaded: uploaded.length,
    skipped: skipped.length,
    failed: failed.length,
    cloudinaryFolder: 'temp-uploads',
    details: { uploaded, skipped, failed }
  };

  fs.writeFileSync('./bulk-upload-report.json', JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n📄 Rapport: ./bulk-upload-report.json`);
  console.log(`\n📁 Toutes les images sont dans le dossier Cloudinary: temp-uploads/`);
  console.log('\n📝 PROCHAINES ÉTAPES:');
  console.log('1. Allez sur https://cloudinary.com/console');
  console.log('2. Naviguez vers le dossier "temp-uploads"');
  console.log('3. Renommez chaque image selon le produit correspondant');
  console.log('4. Déplacez les images dans les dossiers par marque (lattafa/, alhambra/, etc.)');
  console.log('5. Lancez: node cloudinary-image-matcher.js');
  console.log('='.repeat(70) + '\n');
}

bulkUploadToCloudinary().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
