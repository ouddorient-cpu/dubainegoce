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

// Charger les produits
const products = require('./public/js/products-data.js');

// Fonction de normalisation pour le matching
function normalizeForMatching(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour créer un nom de fichier propre pour Cloudinary
function createCloudinaryFilename(productName, brand) {
  const cleanName = productName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\d+\s*ml/gi, '')
    .replace(/eau\s*de\s*parfum/gi, '')
    .replace(/–/g, '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const cleanBrand = brand
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  return `${cleanName}-${cleanBrand}`;
}

// Fonction pour mapper les marques aux dossiers Cloudinary
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

async function uploadImagesToCloudinary() {
  console.log('🚀 Démarrage de l\'upload vers Cloudinary...\n');
  console.log(`📁 Dossier source: ${imagesFolder}\n`);

  // Vérifier si le dossier existe
  if (!fs.existsSync(imagesFolder)) {
    console.error(`❌ Le dossier n'existe pas: ${imagesFolder}`);
    return;
  }

  // Lire tous les fichiers du dossier
  const files = fs.readdirSync(imagesFolder);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`📸 ${imageFiles.length} images trouvées\n`);
  console.log(`📦 ${products.length} produits dans la base\n`);

  const uploaded = [];
  const failed = [];
  const skipped = [];
  let uploadCount = 0;

  // Pour chaque image, essayer de trouver le produit correspondant
  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    const filePath = path.join(imagesFolder, filename);
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const normalized = normalizeForMatching(nameWithoutExt);

    console.log(`\n[${i + 1}/${imageFiles.length}] 📸 ${filename}`);

    // Extraire les mots clés du nom de fichier
    const keywords = normalized.split(' ').filter(word => word.length > 3);

    // Chercher le produit le plus proche
    let bestMatch = null;
    let bestScore = 0;

    products.forEach(product => {
      const productNormalized = normalizeForMatching(product.name);
      const productWords = productNormalized.split(' ').filter(word => word.length > 3);

      let score = 0;

      // Correspondance exacte
      if (productNormalized === normalized) {
        score = 1000;
      } else {
        // Compter les mots en commun
        const matchingWords = keywords.filter(word => productWords.includes(word));
        score = matchingWords.length;

        // Bonus si le nom de fichier contient le nom du produit
        if (normalized.includes(productNormalized) || productNormalized.includes(normalized)) {
          score += 5;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = product;
      }
    });

    if (bestMatch && bestScore >= 2) {
      // Créer le nom de fichier Cloudinary
      const cloudinaryName = createCloudinaryFilename(bestMatch.name, bestMatch.brand);
      const brandFolder = getBrandFolder(bestMatch.brand);
      const publicId = `${brandFolder}/${cloudinaryName}`;

      console.log(`   ✅ Match trouvé: ${bestMatch.name}`);
      console.log(`   📝 Score: ${bestScore}`);
      console.log(`   📤 Upload vers: ${publicId}`);

      try {
        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: false,
          resource_type: 'image',
          folder: brandFolder,
          use_filename: false,
          unique_filename: false
        });

        uploaded.push({
          original: filename,
          product: bestMatch.name,
          brand: bestMatch.brand,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          score: bestScore
        });

        uploadCount++;
        console.log(`   ✅ Upload réussi!`);
        console.log(`   🔗 ${result.secure_url}`);

      } catch (error) {
        if (error.http_code === 400 && error.message.includes('already exists')) {
          skipped.push({
            original: filename,
            product: bestMatch.name,
            reason: 'Fichier déjà existant sur Cloudinary',
            publicId: publicId
          });
          console.log(`   ⚠️  Déjà existant sur Cloudinary, ignoré`);
        } else {
          failed.push({
            original: filename,
            product: bestMatch.name,
            error: error.message
          });
          console.log(`   ❌ Erreur upload: ${error.message}`);
        }
      }

    } else {
      failed.push({
        original: filename,
        bestMatch: bestMatch ? bestMatch.name : 'Aucun',
        score: bestScore,
        reason: 'Score de matching trop faible'
      });
      console.log(`   ❌ Pas de correspondance claire (Score max: ${bestScore})`);
      if (bestMatch) {
        console.log(`   Meilleur candidat: ${bestMatch.name}`);
      }
    }

    // Pause de 100ms entre chaque upload pour éviter rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Générer le rapport
  console.log('\n' + '='.repeat(70));
  console.log('📊 RAPPORT D\'UPLOAD CLOUDINARY');
  console.log('='.repeat(70));
  console.log(`\n📤 Images uploadées: ${uploaded.length}/${imageFiles.length}`);
  console.log(`⚠️  Images ignorées (déjà existantes): ${skipped.length}`);
  console.log(`❌ Images non uploadées: ${failed.length}`);

  // Sauvegarder le rapport détaillé
  const report = {
    timestamp: new Date().toISOString(),
    sourceFolder: imagesFolder,
    totalImages: imageFiles.length,
    uploaded: uploaded.length,
    skipped: skipped.length,
    failed: failed.length,
    details: {
      uploaded,
      skipped,
      failed
    }
  };

  fs.writeFileSync('./cloudinary-upload-report.json', JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 Rapport détaillé sauvegardé: ./cloudinary-upload-report.json`);

  if (uploaded.length > 0) {
    console.log(`\n✨ EXEMPLES D'UPLOADS RÉUSSIS:`);
    uploaded.slice(0, 5).forEach(item => {
      console.log(`   ${item.original}`);
      console.log(`   → ${item.product} | ${item.brand}`);
      console.log(`   🔗 ${item.cloudinaryUrl}\n`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n⚠️  IMAGES NON UPLOADÉES (${failed.length}):`);
    failed.slice(0, 10).forEach(item => {
      console.log(`   - ${item.original}`);
      console.log(`     Raison: ${item.reason || item.error || 'Pas de match'}`);
    });
    if (failed.length > 10) {
      console.log(`   ... et ${failed.length - 10} autres (voir le rapport)`);
    }
  }

  console.log('='.repeat(70) + '\n');

  // Lancer automatiquement le script de matching
  if (uploaded.length > 0) {
    console.log('🔄 Lancement du script de matching Cloudinary...\n');
    const { execSync } = require('child_process');
    try {
      execSync('node cloudinary-image-matcher.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Erreur lors du matching:', error.message);
    }
  }
}

uploadImagesToCloudinary().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
