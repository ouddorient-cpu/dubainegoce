// ============================================
// FIREBASE SERVICES
// Authentication & Database operations
// ============================================

import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc
} from './firebase-config.js';

// ========== AUTHENTICATION ==========

/**
 * Login user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User credential
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Login error:', error);
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
}

/**
 * Register new user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User credential
 */
export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Registration successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Registration error:', error);
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
}

/**
 * Logout current user
 * @returns {Promise<Object>}
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Called when auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get user-friendly error messages
 * @param {string} errorCode
 * @returns {string}
 */
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
    'auth/invalid-email': 'Adresse email invalide',
    'auth/user-not-found': 'Aucun compte avec cette adresse email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
    'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre internet'
  };
  return errorMessages[errorCode] || 'Une erreur est survenue';
}

// ========== ORDERS (FIRESTORE) ==========

/**
 * Create new order in Firestore
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>}
 */
export async function createOrder(orderData) {
  try {
    const order = {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: auth.currentUser?.uid || 'guest',
      orderNumber: generateOrderNumber()
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    console.log('✅ Order created:', docRef.id);

    return {
      success: true,
      orderId: docRef.id,
      orderNumber: order.orderNumber
    };
  } catch (error) {
    console.error('❌ Create order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get orders for current user
 * @returns {Promise<Array>} List of orders
 */
export async function getUserOrders() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Retrieved ${orders.length} orders`);
    return { success: true, orders };
  } catch (error) {
    console.error('❌ Get orders error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get specific order by ID
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
export async function getOrder(orderId) {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        order: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return { success: false, error: 'Order not found' };
    }
  } catch (error) {
    console.error('❌ Get order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update order status
 * @param {string} orderId
 * @param {string} status - 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
 * @returns {Promise<Object>}
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Order ${orderId} updated to ${status}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Update order error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate unique order number
 * @returns {string}
 */
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DN-${timestamp}-${random}`;
}

// ========== NEWSLETTER ==========

/**
 * Subscribe email to newsletter
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function subscribeNewsletter(email) {
  try {
    // Check if email already exists
    const newsletterQuery = query(
      collection(db, 'newsletter'),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(newsletterQuery);

    if (!querySnapshot.empty) {
      return { success: false, error: 'Cet email est déjà inscrit' };
    }

    // Add new subscriber
    await addDoc(collection(db, 'newsletter'), {
      email: email,
      subscribedAt: new Date().toISOString(),
      active: true
    });

    console.log('✅ Newsletter subscription:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Newsletter error:', error);
    return { success: false, error: error.message };
  }
}

// ========== CONTACT/MESSAGES ==========

/**
 * Send contact message
 * @param {Object} messageData - {name, email, subject, message}
 * @returns {Promise<Object>}
 */
export async function sendMessage(messageData) {
  try {
    await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: new Date().toISOString(),
      read: false,
      userId: auth.currentUser?.uid || 'guest'
    });

    console.log('✅ Message sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Send message error:', error);
    return { success: false, error: error.message };
  }
}

// ========== REVIEWS ==========

/**
 * Add product review
 * @param {Object} reviewData - {productId, rating, comment, userName}
 * @returns {Promise<Object>}
 */
export async function addReview(reviewData) {
  try {
    const user = getCurrentUser();

    const review = {
      ...reviewData,
      userId: user?.uid || 'guest',
      userEmail: user?.email || 'guest',
      createdAt: new Date().toISOString(),
      verified: false
    };

    await addDoc(collection(db, 'reviews'), review);

    console.log('✅ Review added');
    return { success: true };
  } catch (error) {
    console.error('❌ Add review error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get reviews for a product
 * @param {number} productId
 * @returns {Promise<Array>}
 */
export async function getProductReviews(productId) {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(reviewsQuery);
    const reviews = [];

    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('❌ Get reviews error:', error);
    return { success: false, error: error.message };
  }
}

// ========== WISHLIST ==========

/**
 * Add product to wishlist
 * @param {number} productId
 * @returns {Promise<Object>}
 */
export async function addToWishlist(productId) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'User must be logged in' };
    }

    await addDoc(collection(db, 'wishlist'), {
      userId: user.uid,
      productId: productId,
      addedAt: new Date().toISOString()
    });

    console.log('✅ Added to wishlist');
    return { success: true };
  } catch (error) {
    console.error('❌ Wishlist error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's wishlist
 * @returns {Promise<Array>}
 */
export async function getWishlist() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const wishlistQuery = query(
      collection(db, 'wishlist'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(wishlistQuery);
    const wishlist = [];

    querySnapshot.forEach((doc) => {
      wishlist.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, wishlist };
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    return { success: false, error: error.message };
  }
}

// ========== ANALYTICS ==========

/**
 * Track product view
 * @param {number} productId
 * @param {string} productName
 */
export async function trackProductView(productId, productName) {
  try {
    await addDoc(collection(db, 'analytics'), {
      type: 'product_view',
      productId: productId,
      productName: productName,
      userId: auth.currentUser?.uid || 'guest',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

/**
 * Track add to cart event
 * @param {number} productId
 * @param {string} productName
 */
export async function trackAddToCart(productId, productName) {
  try {
    await addDoc(collection(db, 'analytics'), {
      type: 'add_to_cart',
      productId: productId,
      productName: productName,
      userId: auth.currentUser?.uid || 'guest',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Export all functions
console.log('🔥 Firebase Services loaded');

export default {
  // Auth
  login,
  register,
  logout,
  getCurrentUser,
  onAuthChange,
  // Orders
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  // Newsletter
  subscribeNewsletter,
  // Messages
  sendMessage,
  // Reviews
  addReview,
  getProductReviews,
  // Wishlist
  addToWishlist,
  getWishlist,
  // Analytics
  trackProductView,
  trackAddToCart
};
