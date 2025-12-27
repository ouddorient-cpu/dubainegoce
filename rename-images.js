const fs = require('fs');
const path = require('path');

// Dossier contenant les images
const imagesFolder = 'C:\\Users\\abder\\OneDrive\\Bureau\\SITES PERSO\\images avec fond gris\\Nouveau dossier';

// Charger les produits
const products = require('./public/js/products-data.js');

// Fonction de normalisation pour le matching
function normalizeForMatching(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/[^\w\s-]/g, ' ') // Remplacer caractères spéciaux par espaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour créer un nom de fichier propre
function createCleanFilename(productName, brand) {
  return productName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\d+\s*ml/gi, '') // Enlever "100ml", "60ml", etc.
    .replace(/eau\s*de\s*parfum/gi, '')
    .replace(/–/g, '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' +
    brand
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
}

async function renameImages() {
  console.log('🚀 Démarrage du renommage des images...\n');
  console.log(`📁 Dossier: ${imagesFolder}\n`);

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

  const renamed = [];
  const notMatched = [];
  const duplicates = [];
  const usedNames = new Set();

  // Pour chaque image, essayer de trouver le produit correspondant
  imageFiles.forEach((filename, index) => {
    const filePath = path.join(imagesFolder, filename);
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const normalized = normalizeForMatching(nameWithoutExt);

    console.log(`[${index + 1}/${imageFiles.length}] Traitement: ${filename}`);

    // Extraire les mots clés du nom de fichier
    const keywords = normalized.split(' ').filter(word => word.length > 3);

    // Chercher le produit le plus proche
    let bestMatch = null;
    let bestScore = 0;

    products.forEach(product => {
      const productNormalized = normalizeForMatching(product.name);
      const productWords = productNormalized.split(' ').filter(word => word.length > 3);

      // Calculer le score de matching
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
      // Créer le nouveau nom de fichier
      let newFilename = createCleanFilename(bestMatch.name, bestMatch.brand) + ext;

      // Vérifier si le nom existe déjà
      if (usedNames.has(newFilename)) {
        let counter = 2;
        let tempFilename = createCleanFilename(bestMatch.name, bestMatch.brand) + `-${counter}` + ext;
        while (usedNames.has(tempFilename)) {
          counter++;
          tempFilename = createCleanFilename(bestMatch.name, bestMatch.brand) + `-${counter}` + ext;
        }
        newFilename = tempFilename;
        duplicates.push({
          original: filename,
          new: newFilename,
          product: bestMatch.name
        });
      }

      usedNames.add(newFilename);
      const newFilePath = path.join(imagesFolder, newFilename);

      // Renommer le fichier
      try {
        fs.renameSync(filePath, newFilePath);
        renamed.push({
          original: filename,
          new: newFilename,
          product: bestMatch.name,
          brand: bestMatch.brand,
          score: bestScore
        });
        console.log(`   ✅ → ${newFilename}`);
        console.log(`   Produit: ${bestMatch.name} (Score: ${bestScore})`);
      } catch (error) {
        console.log(`   ❌ Erreur lors du renommage: ${error.message}`);
      }
    } else {
      notMatched.push({
        filename: filename,
        bestMatch: bestMatch ? bestMatch.name : 'Aucun',
        score: bestScore
      });
      console.log(`   ⚠️  Pas de correspondance claire (Score max: ${bestScore})`);
    }

    console.log('');
  });

  // Générer le rapport
  console.log('\n' + '='.repeat(70));
  console.log('📊 RAPPORT DE RENOMMAGE');
  console.log('='.repeat(70));
  console.log(`\n✅ Fichiers renommés: ${renamed.length}/${imageFiles.length}`);
  console.log(`⚠️  Fichiers non matchés: ${notMatched.length}`);
  console.log(`🔄 Doublons gérés: ${duplicates.length}`);

  // Sauvegarder le rapport détaillé
  const report = {
    timestamp: new Date().toISOString(),
    folder: imagesFolder,
    totalImages: imageFiles.length,
    renamed: renamed.length,
    notMatched: notMatched.length,
    duplicates: duplicates.length,
    details: {
      renamed,
      notMatched,
      duplicates
    }
  };

  fs.writeFileSync('./image-rename-report.json', JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 Rapport détaillé sauvegardé: ./image-rename-report.json`);

  if (notMatched.length > 0) {
    console.log(`\n⚠️  FICHIERS NON MATCHÉS (${notMatched.length}):`);
    notMatched.slice(0, 10).forEach(item => {
      console.log(`   - ${item.filename}`);
      console.log(`     Meilleur match: ${item.bestMatch} (Score: ${item.score})`);
    });
    if (notMatched.length > 10) {
      console.log(`   ... et ${notMatched.length - 10} autres (voir le rapport)`);
    }
  }

  // Afficher quelques exemples de renommage
  if (renamed.length > 0) {
    console.log(`\n✨ EXEMPLES DE RENOMMAGES RÉUSSIS:`);
    renamed.slice(0, 5).forEach(item => {
      console.log(`   ${item.original}`);
      console.log(`   → ${item.new}`);
      console.log(`   Produit: ${item.product} | ${item.brand}\n`);
    });
  }

  console.log('='.repeat(70) + '\n');
}

renameImages().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
