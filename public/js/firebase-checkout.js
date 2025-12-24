// ============================================
// CHECKOUT WITH FIREBASE
// ============================================

import { createOrder, getCurrentUser } from './firebase-services.js';

// ========== CHECKOUT FLOW ==========

export function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', openCheckoutFlow);
}

function openCheckoutFlow() {
    // Get cart from global STATE
    const cart = window.STATE?.cart || [];
    
    if (cart.length === 0) {
        showToast('Votre panier est vide', 'error');
        return;
    }
    
    // Close cart sidebar
    if (window.closeCart) {
        window.closeCart();
    }
    
    // Show checkout modal
    showCheckoutModal(cart);
}

function showCheckoutModal(cart) {
    // Create or get modal
    let modal = document.getElementById('checkoutModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'checkoutModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentUser = getCurrentUser();
    
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeCheckoutModal()"></div>
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <button class="modal-close" onclick="closeCheckoutModal()">&times;</button>
            
            <div style="padding: 3rem;">
                <h2 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 2rem; text-align: center;">
                    Finaliser la commande
                </h2>
                
                <!-- Order Summary -->
                <div style="background: var(--color-bg-secondary); padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Récapitulatif</h3>
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border);">
                            <div>
                                <strong>${item.name}</strong>
                                <span style="color: var(--color-gray); margin-left: 0.5rem;">x${item.quantity}</span>
                            </div>
                            <div style="font-weight: 600;">${(item.price * item.quantity).toFixed(2)}€</div>
                        </div>
                    `).join('')}
                    
                    <div style="display: flex; justify-content: space-between; padding-top: 1rem; margin-top: 1rem; border-top: 2px solid var(--color-primary);">
                        <strong style="font-size: 1.5rem;">Total</strong>
                        <strong style="font-size: 1.5rem; color: var(--color-primary);">${total.toFixed(2)}€</strong>
                    </div>
                </div>
                
                <!-- Checkout Form -->
                <form id="checkoutForm">
                    ${!currentUser ? `
                        <!-- Guest Email -->
                        <div style="margin-bottom: 2rem;">
                            <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Votre email</h3>
                            <input type="email" id="guestEmail" required 
                                   placeholder="email@exemple.com"
                                   style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px; font-size: 1rem;">
                        </div>
                    ` : ''}
                    
                    <!-- Shipping Address -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Adresse de livraison</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="text" id="firstName" required placeholder="Prénom" 
                                   style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px;">
                            <input type="text" id="lastName" required placeholder="Nom" 
                                   style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px;">
                        </div>
                        <input type="text" id="address" required placeholder="Adresse" 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px; margin-top: 1rem;">
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-top: 1rem;">
                            <input type="text" id="postalCode" required placeholder="Code postal" 
                                   style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px;">
                            <input type="text" id="city" required placeholder="Ville" 
                                   style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px;">
                        </div>
                        <input type="text" id="country" value="France" required 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px; margin-top: 1rem;">
                        <input type="tel" id="phone" required placeholder="Téléphone" 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border); border-radius: 4px; margin-top: 1rem;">
                    </div>
                    
                    <!-- Payment Method -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Mode de paiement</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <label style="padding: 1.5rem; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: var(--transition-base);">
                                <input type="radio" name="paymentMethod" value="card" required checked>
                                <div>
                                    <strong style="display: block; margin-bottom: 0.25rem;">Carte bancaire</strong>
                                    <small style="color: var(--color-gray);">Paiement sécurisé par Stripe</small>
                                </div>
                            </label>
                            
                            <label style="padding: 1.5rem; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: var(--transition-base);">
                                <input type="radio" name="paymentMethod" value="paypal" required>
                                <div>
                                    <strong style="display: block; margin-bottom: 0.25rem;">PayPal</strong>
                                    <small style="color: var(--color-gray);">Compte PayPal</small>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Submit -->
                    <button type="submit" 
                            style="width: 100%; padding: 1.25rem; background: var(--color-primary); color: var(--color-charcoal); font-size: 1.125rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: var(--transition-base);"
                            onmouseover="this.style.background='var(--color-primary-dark)'"
                            onmouseout="this.style.background='var(--color-primary)'">
                        Payer ${total.toFixed(2)}€
                    </button>
                    
                    <p style="text-align: center; color: var(--color-gray); font-size: 0.875rem; margin-top: 1rem;">
                        🔒 Paiement 100% sécurisé
                    </p>
                </form>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Setup form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const cart = window.STATE?.cart || [];
    if (cart.length === 0) return;
    
    const currentUser = getCurrentUser();
    
    // Collect form data
    const formData = {
        email: currentUser?.email || document.getElementById('guestEmail').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingAddress: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            postalCode: document.getElementById('postalCode').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value
        },
        billingAddress: {
            // Same as shipping for now
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            postalCode: document.getElementById('postalCode').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value
        },
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Traitement en cours...';
    submitBtn.disabled = true;
    
    try {
        // Create order in Firebase
        const result = await createOrder(formData);
        
        if (result.success) {
            // Clear cart
            if (window.STATE) {
                window.STATE.cart = [];
                if (window.saveCartToStorage) {
                    window.saveCartToStorage();
                }
                if (window.updateCartUI) {
                    window.updateCartUI();
                }
            }
            
            // Close modal
            closeCheckoutModal();
            
            // Show success
            showOrderSuccess(result.orderId, formData.email);
            
            // In production, redirect to payment gateway here
            console.log('Order created:', result.orderId);
            
        } else {
            throw new Error(result.error || 'Erreur lors de la création de la commande');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Erreur: ' + error.message, 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showOrderSuccess(orderId, email) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content" style="max-width: 600px; padding: 3rem; text-align: center;">
            <div style="width: 80px; height: 80px; background: var(--color-success); border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            </div>
            
            <h2 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 1rem;">
                Commande confirmée !
            </h2>
            
            <p style="font-size: 1.125rem; color: var(--color-gray); margin-bottom: 2rem;">
                Votre commande <strong>#${orderId.substring(0, 8)}</strong> a été enregistrée avec succès.
            </p>
            
            <div style="background: var(--color-bg-secondary); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="margin-bottom: 0.5rem;">Un email de confirmation a été envoyé à :</p>
                <strong style="color: var(--color-primary);">${email}</strong>
            </div>
            
            <p style="color: var(--color-gray); margin-bottom: 2rem;">
                Vous recevrez un email avec le suivi de votre colis dès l'expédition.
            </p>
            
            <button onclick="location.reload()" 
                    style="padding: 1rem 2rem; background: var(--color-primary); color: var(--color-charcoal); font-weight: 600; border-radius: 4px; cursor: pointer;">
                Continuer mes achats
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }, 100);
}

window.closeCheckoutModal = function() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Show toast (use global function if available)
function showToast(message, type) {
    if (window.showToast) {
        window.showToast(message, type);
    } else {
        alert(message);
    }
}

console.log('💳 Checkout Firebase initialisé');

// Export for use in other modules
export { showCheckoutModal, closeCheckoutModal };
