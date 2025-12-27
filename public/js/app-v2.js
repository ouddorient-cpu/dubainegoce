// ============================================
// DUBAINEGOCE - APPLICATION PRINCIPALE
// E-commerce de parfums de Dubaï
// ============================================

// ========== GLOBAL STATE ==========
window.STATE = {
  cart: [],
  filteredProducts: [],
  currentPage: 1,
  itemsPerPage: 12,
  filters: {
    brands: [],
    categories: [],
    badges: [],
    priceRange: []
  },
  sortBy: 'default',
  searchQuery: '',
  viewMode: 'grid'
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DubaiNegoce App Starting...');

  // Load cart from localStorage
  loadCartFromStorage();

  // Initialize products
  initializeProducts();

  // Setup event listeners
  setupEventListeners();

  // Start banner rotation
  startBannerRotation();

  // Show welcome modal
  showWelcomeModal();

  // Setup header scroll effect
  setupHeaderScroll();

  // Setup back to top button
  setupBackToTop();

  console.log('✅ App initialized successfully');
});

// ========== PRODUCTS MANAGEMENT ==========

/**
 * Initialize products display
 */
function initializeProducts() {
  if (typeof PRODUCTS_DATABASE === 'undefined') {
    console.error('❌ Products database not loaded!');
    return;
  }

  STATE.filteredProducts = [...PRODUCTS_DATABASE];
  renderProducts();
  updateProductsCount();
}

/**
 * Render products to grid
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const start = (STATE.currentPage - 1) * STATE.itemsPerPage;
  const end = start + STATE.itemsPerPage;
  const productsToShow = STATE.filteredProducts.slice(start, end);

  if (productsToShow.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 1rem; opacity: 0.3;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">
          Aucun produit trouvé
        </h3>
        <p style="color: var(--color-gray);">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productsToShow.map(product => `
    <div class="product-card fade-in">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      <div class="product-image">
        <img src="${product.image}"
             alt="${product.name}"
             loading="lazy"
             onerror="this.src='https://res.cloudinary.com/dzntnjtkc/image/upload/v1/placeholder-perfume.jpg'; this.classList.add('image-error');">
        <button class="product-quick-view" onclick="openQuickView(${product.id})">
          Aperçu rapide
        </button>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-footer">
          <span class="product-price">${product.price}€</span>
          <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Update load more button
  updateLoadMoreButton();
}

/**
 * Update products count display
 */
function updateProductsCount() {
  const countEl = document.getElementById('productsCount');
  if (countEl) {
    countEl.textContent = STATE.filteredProducts.length;
  }
}

/**
 * Update load more button visibility
 */
function updateLoadMoreButton() {
  const loadMoreSection = document.getElementById('loadMoreSection');
  const totalPages = Math.ceil(STATE.filteredProducts.length / STATE.itemsPerPage);

  if (loadMoreSection) {
    if (STATE.currentPage >= totalPages) {
      loadMoreSection.style.display = 'none';
    } else {
      loadMoreSection.style.display = 'block';
    }
  }
}

/**
 * Load more products
 */
window.loadMore = function() {
  STATE.currentPage++;
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ========== FILTERING & SORTING ==========

/**
 * Apply filters to products
 */
function applyFilters() {
  let filtered = [...PRODUCTS_DATABASE];

  // Apply brand filters
  if (STATE.filters.brands.length > 0) {
    filtered = filtered.filter(p => STATE.filters.brands.includes(p.brand));
  }

  // Apply category filters
  if (STATE.filters.categories.length > 0) {
    filtered = filtered.filter(p => STATE.filters.categories.includes(p.category));
  }

  // Apply badge filters
  if (STATE.filters.badges.length > 0) {
    filtered = filtered.filter(p => p.badge && STATE.filters.badges.includes(p.badge));
  }

  // Apply search query
  if (STATE.searchQuery) {
    const query = STATE.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  filtered = sortProducts(filtered);

  STATE.filteredProducts = filtered;
  STATE.currentPage = 1;
  renderProducts();
  updateProductsCount();
}

/**
 * Sort products
 */
function sortProducts(products) {
  const sorted = [...products];

  switch (STATE.sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

/**
 * Reset all filters
 */
window.resetFilters = function() {
  // Uncheck all checkboxes
  document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });

  // Reset state
  STATE.filters = {
    brands: [],
    categories: [],
    badges: [],
    priceRange: []
  };
  STATE.searchQuery = '';
  STATE.sortBy = 'default';

  // Reset UI
  const searchInput = document.getElementById('headerSearchInput');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'default';

  applyFilters();
  showToast('Filtres réinitialisés', 'success');
};

/**
 * Toggle mobile filters
 */
window.toggleMobileFilters = function() {
  const sidebar = document.getElementById('sidebarFilters');
  sidebar.classList.toggle('active');
};

// ========== SEARCH ==========

/**
 * Handle search input
 */
function handleSearch(query) {
  STATE.searchQuery = query.trim();
  applyFilters();
}

// ========== CART MANAGEMENT ==========

/**
 * Add product to cart
 */
window.addToCart = function(productId) {
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (!product) return;

  const existingItem = STATE.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    STATE.cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`${product.name} ajouté au panier`, 'success');
};

/**
 * Remove from cart
 */
window.removeFromCart = function(productId) {
  const index = STATE.cart.findIndex(item => item.id === productId);
  if (index > -1) {
    const product = STATE.cart[index];
    STATE.cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
    showToast(`${product.name} retiré du panier`, 'success');
  }
};

/**
 * Update cart item quantity
 */
window.updateCartQuantity = function(productId, quantity) {
  const item = STATE.cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCartToStorage();
    updateCartUI();
  }
};

/**
 * Update cart UI
 */
window.updateCartUI = function() {
  const badge = document.getElementById('cartBadge');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');

  // Update badge
  const totalItems = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.textContent = totalItems;
  }

  // Update cart body
  if (cartBody) {
    if (STATE.cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M9 2L7.17 4H2v2h20V4h-5.17L15 2H9z"/>
            <path d="M4 6v13c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6H4z"/>
          </svg>
          <p>Votre panier est vide</p>
        </div>
      `;
    } else {
      cartBody.innerHTML = STATE.cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-brand">${item.brand}</p>
            <p class="cart-item-price">${item.price}€</p>
          </div>
          <div class="cart-item-actions">
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
              <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Update total
  if (cartTotal) {
    const total = STATE.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total.toFixed(2)} €`;
  }
};

/**
 * Open cart sidebar
 */
window.openCart = function() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  if (sidebar) sidebar.classList.add('active');
  if (overlay) overlay.classList.add('active');

  document.body.style.overflow = 'hidden';
};

/**
 * Close cart sidebar
 */
window.closeCart = function() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');

  document.body.style.overflow = '';
};

/**
 * Save cart to localStorage
 */
window.saveCartToStorage = function() {
  localStorage.setItem('dubaiNegoceCart', JSON.stringify(STATE.cart));
};

/**
 * Load cart from localStorage
 */
function loadCartFromStorage() {
  const saved = localStorage.getItem('dubaiNegoceCart');
  if (saved) {
    try {
      STATE.cart = JSON.parse(saved);
      updateCartUI();
    } catch (e) {
      console.error('Error loading cart:', e);
      STATE.cart = [];
    }
  }
}

// ========== QUICK VIEW MODAL ==========

/**
 * Open quick view modal
 */
window.openQuickView = function(productId) {
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');

  if (!modal || !content) return;

  content.innerHTML = `
    <div class="quick-view-content">
      <img src="${product.image}" alt="${product.name}" class="quick-view-image">
      <div class="quick-view-info">
        <p class="quick-view-brand">${product.brand}</p>
        <h2 class="quick-view-title">${product.name}</h2>
        <div class="quick-view-price">${product.price}€</div>
        <span class="quick-view-category">${product.category}</span>
        <p class="quick-view-description">${product.description}</p>
        <div class="quick-view-actions">
          <button class="btn-add-large" onclick="addToCart(${product.id}); closeQuickView();">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

/**
 * Close quick view modal
 */
window.closeQuickView = function() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};


// ========== TOP BANNER ==========

let currentBanner = 0;
let bannerInterval;

/**
 * Start banner rotation
 */
function startBannerRotation() {
  const banners = document.querySelectorAll('.banner-item');
  if (banners.length <= 1) return;

  bannerInterval = setInterval(() => {
    banners[currentBanner].classList.remove('active');
    currentBanner = (currentBanner + 1) % banners.length;
    banners[currentBanner].classList.add('active');
  }, 3000);
}

/**
 * Close top banner
 */
window.closeBanner = function() {
  const banner = document.getElementById('topBanner');
  if (banner) {
    banner.style.display = 'none';
    clearInterval(bannerInterval);
  }
};

// ========== WELCOME MODAL ==========

/**
 * Show welcome modal (only once per session)
 */
function showWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (!modal) return;

  // Check if user has already seen the modal
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

  // Show modal after 1 second if user hasn't seen it
  if (!hasSeenWelcome) {
    setTimeout(() => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 1000);
  }
}

/**
 * Close welcome modal
 */
window.closeWelcomeModal = function() {
  const modal = document.getElementById('welcomeModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';

  // Mark as seen in localStorage
  localStorage.setItem('hasSeenWelcome', 'true');
};

// Close modal when clicking on overlay
document.addEventListener('click', (e) => {
  const modal = document.getElementById('welcomeModal');
  if (modal && e.target.classList.contains('welcome-modal-overlay')) {
    closeWelcomeModal();
  }
});

// ========== HEADER EFFECTS ==========

/**
 * Setup header scroll effect
 */
function setupHeaderScroll() {
  const header = document.getElementById('mainHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ========== BACK TO TOP ==========

/**
 * Setup back to top button
 */
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== EVENT LISTENERS ==========

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Cart buttons
  const cartBtn = document.getElementById('cartBtnHeader');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Mobile menu
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }

  // Search
  const searchInput = document.getElementById('headerSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.sortBy = e.target.value;
      applyFilters();
    });
  }

  // View toggle
  const viewBtns = document.querySelectorAll('.view-btn');
  const productsGrid = document.getElementById('productsGrid');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.dataset.view;
      STATE.viewMode = view;

      if (productsGrid) {
        if (view === 'list') {
          productsGrid.classList.add('list-view');
        } else {
          productsGrid.classList.remove('list-view');
        }
      }
    });
  });

  // Load more button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMore);
  }

  // Filter checkboxes
  document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const name = e.target.name;
      const value = e.target.value;

      if (e.target.checked) {
        if (name === 'brand') {
          STATE.filters.brands.push(value);
        } else if (name === 'category') {
          STATE.filters.categories.push(value);
        } else if (name === 'badge') {
          STATE.filters.badges.push(value);
        }
      } else {
        if (name === 'brand') {
          STATE.filters.brands = STATE.filters.brands.filter(b => b !== value);
        } else if (name === 'category') {
          STATE.filters.categories = STATE.filters.categories.filter(c => c !== value);
        } else if (name === 'badge') {
          STATE.filters.badges = STATE.filters.badges.filter(b => b !== value);
        }
      }

      applyFilters();
    });
  });

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;

      // In production, send to Firebase
      showToast('Merci pour votre inscription !', 'success');
      e.target.reset();
    });
  }

  // Brand links in mega menu
  document.querySelectorAll('[data-brand]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const brand = e.target.dataset.brand;

      // Reset and apply brand filter
      resetFilters();
      STATE.filters.brands = [brand];

      // Check the corresponding checkbox
      const checkbox = document.querySelector(`input[name="brand"][value="${brand}"]`);
      if (checkbox) checkbox.checked = true;

      applyFilters();

      // Scroll to products
      document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ========== TOAST NOTIFICATIONS ==========

/**
 * Show toast notification
 */
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.success}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Debounce function for search
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format price
 */
function formatPrice(price) {
  return `${price.toFixed(2)}€`;
}

/**
 * Smooth scroll to element
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========== EXPORT FUNCTIONS ==========
// Make functions available globally for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.resetFilters = resetFilters;
window.toggleMobileFilters = toggleMobileFilters;
window.closeBanner = closeBanner;
window.closeWelcomeModal = closeWelcomeModal;
window.showToast = showToast;
window.updateCartUI = updateCartUI;
window.saveCartToStorage = saveCartToStorage;

console.log('✅ DubaiNegoce App loaded successfully');
