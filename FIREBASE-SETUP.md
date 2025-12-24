# 🔥 Guide Firebase - DubaiNegoce

## Configuration Firebase Complète

Ce guide vous explique comment configurer Firebase pour votre site DubaiNegoce.

---

## 📋 Prérequis

Vous avez déjà :
- ✅ Configuration Firebase (`firebaseConfig`)
- ✅ Projet Firebase créé
- ✅ Application Web enregistrée

---

## 🚀 Étape 1 : Configuration Firestore

### 1.1 Activer Firestore

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner votre projet : `studio-9269357231-ea935`
3. Menu latéral > **Firestore Database**
4. Cliquer sur **Créer une base de données**
5. Choisir le mode :
   - **Mode production** (recommandé)
   - Location : `europe-west1` (ou la plus proche)

### 1.2 Règles de Sécurité

Dans l'onglet **Règles**, copier-coller :

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Orders - Les utilisateurs peuvent lire leurs propres commandes
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if true; // Permet la création même pour les invités
      allow update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users - Les utilisateurs peuvent lire/modifier leur profil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Newsletter - Tout le monde peut s'inscrire
    match /newsletter/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Messages - Tout le monde peut envoyer
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Products - Lecture publique, écriture admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 🔐 Étape 2 : Activer l'Authentification

### 2.1 Configuration

1. Menu latéral > **Authentication**
2. Onglet **Sign-in method**
3. Activer :
   - ✅ **Email/Mot de passe**
   - ✅ **Google** (optionnel)
   - ✅ **Facebook** (optionnel)

### 2.2 Paramètres Email

1. Onglet **Templates**
2. Personnaliser les emails :
   - Vérification d'email
   - Réinitialisation mot de passe
   - Changement d'email

---

## 📊 Étape 3 : Structure Firestore

Créez ces collections dans Firestore :

### Collection `orders`
```javascript
{
  userId: "string",          // UID de l'utilisateur ou "guest"
  userEmail: "string",        // Email du client
  items: [                    // Produits commandés
    {
      id: "number",
      name: "string",
      brand: "string",
      price: "number",
      quantity: "number",
      image: "string"
    }
  ],
  total: "number",            // Montant total
  shippingAddress: {
    firstName: "string",
    lastName: "string",
    address: "string",
    postalCode: "string",
    city: "string",
    country: "string",
    phone: "string"
  },
  billingAddress: { ... },    // Même structure
  paymentMethod: "string",    // "card" ou "paypal"
  status: "string",           // "pending", "paid", "shipped", "delivered", "cancelled"
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Collection `users`
```javascript
{
  uid: "string",              // UID Firebase Auth
  email: "string",
  firstName: "string",
  lastName: "string",
  phone: "string",
  addresses: [                // Adresses sauvegardées
    {
      type: "string",         // "shipping" ou "billing"
      address: "string",
      postalCode: "string",
      city: "string",
      country: "string",
      isDefault: "boolean"
    }
  ],
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Collection `newsletter`
```javascript
{
  email: "string",
  subscribedAt: "timestamp",
  active: "boolean"
}
```

### Collection `messages`
```javascript
{
  name: "string",
  email: "string",
  subject: "string",
  message: "string",
  userId: "string | null",
  status: "string",           // "new", "read", "replied"
  createdAt: "timestamp"
}
```

### Collection `products` (Optionnel)
```javascript
{
  id: "number",
  name: "string",
  brand: "string",
  price: "number",
  image: "string",
  category: "string",
  badge: "string | null",
  description: "string",
  stock: "number",
  active: "boolean"
}
```

---

## 🎯 Étape 4 : Indexation Firestore

Pour optimiser les requêtes, créez ces index :

### Orders Collection
1. **Aller dans Firestore > Index**
2. **Créer un index composite** :
   - Collection : `orders`
   - Champs :
     - `userId` : Ascending
     - `createdAt` : Descending

---

## 🔒 Étape 5 : Configuration CORS (Storage)

Si vous utilisez Firebase Storage pour les images :

1. Menu latéral > **Storage**
2. Onglet **Règles**
3. Ajouter :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 📧 Étape 6 : Configuration Email (Optionnel)

Pour envoyer des emails de confirmation :

### Option 1 : Firebase Extensions

1. Menu latéral > **Extensions**
2. Installer : **Trigger Email**
3. Configuration :
   - SMTP : Votre serveur email
   - From : `noreply@dubainegoce.fr`

### Option 2 : Cloud Functions

Créer une fonction pour envoyer des emails :

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre-email@gmail.com',
    pass: 'votre-mot-de-passe-app'
  }
});

// Trigger sur nouvelle commande
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    const mailOptions = {
      from: 'DubaiNegoce <noreply@dubainegoce.fr>',
      to: order.userEmail,
      subject: `Commande confirmée #${context.params.orderId.substring(0, 8)}`,
      html: `
        <h1>Merci pour votre commande !</h1>
        <p>Votre commande a été confirmée.</p>
        <p>Numéro de commande : <strong>#${context.params.orderId}</strong></p>
        <p>Total : <strong>${order.total.toFixed(2)}€</strong></p>
        <p>Vous recevrez un email dès l'expédition de votre colis.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email envoyé:', order.userEmail);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  });
```

---

## 🧪 Étape 7 : Test de Configuration

### 7.1 Test Authentification

```javascript
// Dans la console du navigateur
// Créer un compte test
const email = "test@dubainegoce.fr";
const password = "test123456";

// La fonction est disponible globalement
// Via le bouton "Mon compte" dans le header
```

### 7.2 Test Commande

1. Ajouter des produits au panier
2. Cliquer sur "Commander"
3. Remplir le formulaire
4. Vérifier dans Firebase Console > Firestore > orders

### 7.3 Test Newsletter

1. Remplir le formulaire newsletter
2. Vérifier dans Firebase Console > Firestore > newsletter

---

## 📱 Étape 8 : Configuration Analytics (Optionnel)

Pour suivre les conversions :

1. Menu latéral > **Analytics**
2. Activer Google Analytics
3. Dans le code, les événements sont déjà trackés :
   - `add_to_cart`
   - `begin_checkout`
   - `purchase`

---

## 🔑 Étape 9 : Variables d'Environnement

### Pour le développement local

Créer un fichier `.env.local` :

```env
VITE_FIREBASE_API_KEY=AIzaSyBIQdZycIKoS3sVBKBiqa0_dwnVq47KW5Q
VITE_FIREBASE_AUTH_DOMAIN=studio-9269357231-ea935.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-9269357231-ea935
VITE_FIREBASE_STORAGE_BUCKET=studio-9269357231-ea935.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=626776869456
VITE_FIREBASE_APP_ID=1:626776869456:web:524bbfb0de4b57f98e9f55
VITE_FIREBASE_MEASUREMENT_ID=G-5SGH7BZYB0
```

### Pour la production

Utiliser les variables d'environnement de votre plateforme :
- **Netlify** : Site settings > Environment variables
- **Vercel** : Project settings > Environment Variables
- **Firebase Hosting** : Utilise automatiquement la config

---

## 🚀 Déploiement

### Option 1 : Firebase Hosting

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser
firebase init hosting

# Sélectionner :
# - Public directory: public
# - Single-page app: Yes
# - Overwrite index.html: No

# Déployer
firebase deploy --only hosting
```

### Option 2 : Netlify / Vercel

1. Connecter votre repo GitHub
2. Configurer :
   - Build command : (vide)
   - Publish directory : `public`
3. Ajouter les variables d'environnement
4. Déployer

---

## 📊 Dashboard Admin (Bonus)

Pour gérer les commandes, créer une page admin :

### `/admin/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Admin - DubaiNegoce</title>
</head>
<body>
    <h1>Tableau de bord Admin</h1>
    
    <div id="orders"></div>
    
    <script type="module">
        import { db, collection, getDocs, query, orderBy } from '../js/firebase-config.js';
        
        async function loadOrders() {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            
            const ordersDiv = document.getElementById('orders');
            
            snapshot.forEach(doc => {
                const order = doc.data();
                ordersDiv.innerHTML += `
                    <div>
                        <h3>Commande #${doc.id}</h3>
                        <p>Client: ${order.userEmail}</p>
                        <p>Total: ${order.total}€</p>
                        <p>Status: ${order.status}</p>
                    </div>
                `;
            });
        }
        
        loadOrders();
    </script>
</body>
</html>
```

---

## ✅ Checklist Finale

Avant de passer en production :

- [ ] Firestore activé et configuré
- [ ] Règles de sécurité en place
- [ ] Authentication activée
- [ ] Collections créées
- [ ] Index créés
- [ ] Test commande effectué
- [ ] Test authentification effectué
- [ ] Analytics configuré (optionnel)
- [ ] Emails configurés (optionnel)
- [ ] Backup Firestore configuré
- [ ] Monitoring activé

---

## 🆘 Dépannage

### Erreur "Missing or insufficient permissions"
- Vérifier les règles Firestore
- S'assurer que l'utilisateur est authentifié si nécessaire

### Erreur CORS
- Vérifier que le domaine est autorisé dans Firebase Console > Authentication > Settings

### Orders non créées
- Vérifier la console du navigateur pour les erreurs
- Vérifier que Firestore est activé
- Vérifier les règles de sécurité

### Emails non reçus
- Vérifier le dossier spam
- Vérifier la configuration SMTP
- Vérifier les logs Cloud Functions

---

## 📚 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**🔥 Votre Firebase est prêt !**

Vous pouvez maintenant :
- ✅ Créer des commandes
- ✅ Gérer les utilisateurs
- ✅ Stocker la newsletter
- ✅ Recevoir les messages
- ✅ Suivre les analytics
