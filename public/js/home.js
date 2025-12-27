// ============================================
// HOME PAGE JAVASCRIPT
// ============================================

import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy, limit } from './firebase-config.js';

// Load products data
let allProducts = [];

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  loadBestSellers();
  loadNouveautes();
  loadLattafaProducts();
  initializeNewsletter();
  updateCartBadge();
  initHeroVideoCarousel();
});

// Load all products
async function loadProducts() {
  try {
    // Try to load from Firebase first
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    if (!querySnapshot.empty) {
      allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      // Fallback to local data
      const response = await fetch('/js/products-data.js');
      const text = await response.text();
      // Extract products array from the JS file
      const match = text.match(/const products = (\[[\s\S]*?\]);/);
      if (match) {
        allProducts = eval(match[1]);
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
    // Load from local products-data.js as fallback
    if (window.products) {
      allProducts = window.products;
    }
  }
}

// Load Best Sellers - 4 produits iconiques
function loadBestSellers() {
  const container = document.getElementById('bestSellersSlider');
  if (!container) return;

  // Produits iconiques sélectionnés manuellement par nom exact
  const iconicProducts = [
    'Khamrah 100 ml – Lattafa – Mixte',
    'Yara 100 ml Lattafa-Femme',
    'Ramz Gold 100ml – Lattafa mixte',
    'Lovely Cherie 100ml Alhambra – Femme'
  ];

  // Trouver les produits iconiques
  let bestSellers = [];
  iconicProducts.forEach(name => {
    const product = allProducts.find(p => p.name === name);
    if (product) {
      bestSellers.push(product);
    }
  });

  // Si on n'a pas trouvé les 4, compléter avec les best-sellers par rating
  if (bestSellers.length < 4) {
    const additional = allProducts
      .filter(p => !bestSellers.includes(p) && (p.bestseller || parseFloat(p.rating) >= 4.5))
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 4 - bestSellers.length);
    bestSellers.push(...additional);
  }

  bestSellers = bestSellers.slice(0, 4);
  container.innerHTML = bestSellers.map(product => createProductCard(product)).join('');
}

// Load Nouveautés
function loadNouveautes() {
  const container = document.getElementById('nouveautesSlider');
  if (!container) return;

  // Filter new products (you can add a nouveau flag)
  const nouveautes = allProducts
    .filter(p => p.nouveau || p.new)
    .slice(0, 4);

  container.innerHTML = nouveautes.map(product => createProductCard(product)).join('');
}

// Load Lattafa Products
function loadLattafaProducts() {
  const container = document.getElementById('lattafaProducts');
  if (!container) return;

  const lattafaProducts = allProducts
    .filter(p => p.brand?.toLowerCase() === 'lattafa')
    .slice(0, 4);

  container.innerHTML = lattafaProducts.map(product => createProductCard(product, true)).join('');
}

// Create Product Card HTML
function createProductCard(product, compact = false) {
  const cardClass = compact ? 'product-card-compact' : 'product-card';

  return `
    <div class="${cardClass}" data-product-id="${product.id}">
      <div class="product-image">
        ${product.bestseller ? '<span class="product-badge bestseller">Best-Seller</span>' : ''}
        ${product.nouveau || product.new ? '<span class="product-badge new">Nouveau</span>' : ''}
        <img src="${product.image}"
             alt="${product.name}"
             loading="lazy"
             onerror="this.src='https://res.cloudinary.com/dzntnjtkc/image/upload/v1/placeholder-perfume.jpg'; this.classList.add('image-error');">
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-name">${product.name}</h3>
        ${!compact ? `<p class="product-description">${product.description || ''}</p>` : ''}
        <div class="product-rating">
          <div class="stars">${'★'.repeat(Math.floor(product.rating || 4))}${'☆'.repeat(5 - Math.floor(product.rating || 4))}</div>
          <span>(${product.reviews || 0} avis)</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price">${product.price || '35'}€</span>
          </div>
          <button class="btn-add-to-cart" onclick="addToCart('${product.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `;
}

// Add to Cart Function
window.addToCart = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Check if product already in cart
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price || 35,
      image: product.image,
      quantity: 1
    });
  }

  // Save cart
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart badge
  updateCartBadge();

  // Show notification
  showNotification('Produit ajouté au panier!');
};

// Update Cart Badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Show Notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize Newsletter
function initializeNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;

    try {
      // Save to Firebase (you can implement this)
      // For now, just show success message
      showNotification('Merci pour votre inscription! Vérifiez votre email.');
      form.reset();
    } catch (error) {
      console.error('Newsletter error:', error);
      showNotification('Erreur lors de l\'inscription. Réessayez plus tard.');
    }
  });
}

// Cart Button Event
document.getElementById('cartBtnHeader')?.addEventListener('click', () => {
  window.location.href = 'cart.html';
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .product-card, .product-card-compact {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .product-card:hover, .product-card-compact:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }

  .product-image {
    position: relative;
    padding-top: 100%;
    overflow: hidden;
    background: #f8f9fa;
  }

  .product-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .product-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 1;
  }

  .product-badge.bestseller {
    background: #D4AF37;
    color: white;
  }

  .product-badge.new {
    background: #10b981;
    color: white;
  }

  .product-info {
    padding: 20px;
  }

  .product-brand {
    font-size: 0.85rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .product-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1a1a1a;
  }

  .product-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .product-rating .stars {
    color: #D4AF37;
    font-size: 0.95rem;
  }

  .product-rating span {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-price .price {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #8B6D47;
  }

  .btn-add-to-cart {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #8B6D47;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .btn-add-to-cart:hover {
    background: #6d5436;
  }
`;
document.head.appendChild(style);

console.log('🏠 Home page initialized');


// FAQ Toggle Function
window.toggleFAQ = function(button) {
  const faqItem = button.closest('.faq-item');
  const answer = faqItem.querySelector('.faq-answer');
  const icon = button.querySelector('.faq-icon');
  const wasActive = faqItem.classList.contains('active');

  // Fermer tous les FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
    const ans = item.querySelector('.faq-answer');
    const ic = item.querySelector('.faq-icon');
    ans.style.maxHeight = '0';
    ans.style.padding = '0 30px';
    ic.textContent = '+';
  });

  // Ouvrir celui cliqué s'il n'était pas actif
  if (!wasActive) {
    faqItem.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 50 + 'px';
    answer.style.padding = '0 30px 25px 30px';
    icon.textContent = '−';
  }
};

// ============================================
// HERO VIDEO CAROUSEL
// ============================================
function initHeroVideoCarousel() {
  // Sélectionner tous les conteneurs de vidéos dans le hero
  const videoContainers = document.querySelectorAll('.slide-image-grid .video-container');

  videoContainers.forEach(container => {
    const videos = container.querySelectorAll('.hero-video');
    if (videos.length <= 1) return; // Pas de carousel si 1 seule vidéo

    let currentIndex = 0;

    // Fonction pour changer de vidéo
    function nextVideo() {
      // Cacher la vidéo actuelle
      videos[currentIndex].classList.remove('active');

      // Passer à la suivante
      currentIndex = (currentIndex + 1) % videos.length;

      // Afficher la nouvelle vidéo
      videos[currentIndex].classList.add('active');
    }

    // Changer de vidéo toutes les 4 secondes
    setInterval(nextVideo, 4000);
  });

  console.log('🎬 Hero video carousel initialized');
}
