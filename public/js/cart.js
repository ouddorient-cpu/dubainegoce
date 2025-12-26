// ============================================
// CART PAGE JAVASCRIPT
// ============================================

let cart = [];
let discountCode = null;
let discountAmount = 0;

// Promo codes
const PROMO_CODES = {
  'BIENVENUE10': { type: 'percent', value: 10, description: '10% de réduction' },
  'DUBAI15': { type: 'percent', value: 15, description: '15% de réduction' },
  'FREEDELIVERY': { type: 'shipping', value: 0, description: 'Livraison gratuite' },
};

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
});

// Load cart from localStorage
function loadCart() {
  const stored = localStorage.getItem('cart');
  cart = stored ? JSON.parse(stored) : [];
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');

  if (cart.length === 0) {
    cartItems.style.display = 'none';
    emptyCart.style.display = 'flex';
    updateSummary();
    return;
  }

  cartItems.style.display = 'block';
  emptyCart.style.display = 'none';

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <h3 class="cart-item-name">${item.name}</h3>
        <div class="cart-item-price">${item.price}€ / unité</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-remove">
        <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)}€</div>
        <button class="btn-remove" onclick="removeItem(${index})">Retirer</button>
      </div>
    </div>
  `).join('');

  updateSummary();
}

// Update quantity
window.updateQuantity = function(index, change) {
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
  showNotification(change > 0 ? 'Quantité augmentée' : 'Quantité diminuée');
};

// Remove item
window.removeItem = function(index) {
  const item = cart[index];
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showNotification(`${item.name} retiré du panier`);
};

// Update summary
function updateSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate discount
  discountAmount = 0;
  if (discountCode && PROMO_CODES[discountCode]) {
    const promo = PROMO_CODES[discountCode];
    if (promo.type === 'percent') {
      discountAmount = subtotal * (promo.value / 100);
    }
  }

  // Calculate shipping (free above 49€)
  const shipping = subtotal >= 49 ? 0 : 4.90;
  const total = subtotal - discountAmount + shipping;

  // Update DOM
  document.getElementById('subtotal').textContent = subtotal.toFixed(2) + '€';

  const shippingEl = document.getElementById('shipping');
  if (subtotal >= 49) {
    shippingEl.innerHTML = '<span style="color: #10b981; font-weight: 600;">GRATUITE 🎉</span>';
  } else if (cart.length > 0) {
    shippingEl.textContent = shipping.toFixed(2) + '€';
  } else {
    shippingEl.textContent = 'Calculée à la prochaine étape';
  }

  // Discount line
  const discountLine = document.getElementById('discountLine');
  if (discountAmount > 0) {
    discountLine.style.display = 'flex';
    document.getElementById('discount').textContent = '-' + discountAmount.toFixed(2) + '€';
  } else {
    discountLine.style.display = 'none';
  }

  document.getElementById('total').textContent = total.toFixed(2) + '€';
}

// Apply promo code
window.applyPromo = function() {
  const input = document.getElementById('promoInput');
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showNotification('Veuillez entrer un code promo', 'error');
    return;
  }

  if (cart.length === 0) {
    showNotification('Votre panier est vide', 'error');
    return;
  }

  if (PROMO_CODES[code]) {
    discountCode = code;
    input.value = '';
    input.disabled = true;
    updateSummary();
    showNotification(`Code "${code}" appliqué: ${PROMO_CODES[code].description}`, 'success');
  } else {
    showNotification('Code promo invalide', 'error');
  }
};

// Proceed to checkout
window.proceedToCheckout = function() {
  if (cart.length === 0) {
    showNotification('Votre panier est vide', 'error');
    return;
  }

  // Save discount code to localStorage
  if (discountCode) {
    localStorage.setItem('discountCode', discountCode);
  }

  // Redirect to checkout
  window.location.href = 'checkout.html';
};

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8B6D47';

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${bgColor};
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
`;
document.head.appendChild(style);

console.log('🛒 Cart page initialized');
