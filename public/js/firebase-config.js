// ============================================
// FIREBASE CONFIGURATION
// ============================================

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIQdZycIKoS3sVBKBiqa0_dwnVq47KW5Q",
  authDomain: "studio-9269357231-ea935.firebaseapp.com",
  projectId: "studio-9269357231-ea935",
  storageBucket: "studio-9269357231-ea935.firebasestorage.app",
  messagingSenderId: "626776869456",
  appId: "1:626776869456:web:524bbfb0de4b57f98e9f55",
  measurementId: "G-5SGH7BZYB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export Firebase services
export { app, auth, db, analytics };

// Export Firebase functions
export {
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
  updateDoc,
  deleteDoc
};

console.log('🔥 Firebase initialisé avec succès');
