# 🔥 DubaiNegoce - E-commerce de Parfums de Dubaï

Site e-commerce professionnel pour la vente de parfums authentiques de Dubaï, propulsé par Firebase.

## ✨ Fonctionnalités

- 🛍️ **Catalogue de 110+ parfums** de marques premium (Lattafa, Maison Alhambra, Fragrance World, etc.)
- 🛒 **Panier intelligent** avec sauvegarde locale et synchronisation Firebase
- 🔐 **Authentification Firebase** (création compte, connexion)
- 💳 **Système de commande complet** avec Firestore
- 🔍 **Recherche et filtres** avancés (marque, catégorie, prix)
- 📱 **Design responsive** et moderne
- 🎨 **Interface luxueuse** avec animations fluides

## 🏗️ Technologies

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Déploiement**: Firebase App Hosting

## 🚀 Déploiement

Ce projet est configuré pour Firebase App Hosting avec déploiement automatique depuis GitHub.

### URL de production
- Site web: https://dubainegoce-495be.web.app
- Firebase Console: https://console.firebase.google.com/project/dubainegoce-495be

## 📁 Structure du projet

```
dubainegocev2/
├── public/                      # Fichiers publics du site
│   ├── index.html              # Page principale
│   ├── css/
│   │   └── styles-v2.css       # Styles modernes
│   ├── js/
│   │   ├── products-data.js    # Base de 110+ parfums
│   │   ├── app-v2.js           # Application principale
│   │   ├── firebase-config.js  # Configuration Firebase
│   │   ├── firebase-services.js # Services Firebase
│   │   └── firebase-checkout.js # Système de checkout
│   └── images/                 # Images produits
├── firebase.json               # Config Firebase Hosting
├── firestore.rules            # Règles de sécurité Firestore
├── firestore.indexes.json     # Index Firestore
├── apphosting.yaml            # Config App Hosting
└── README.md                  # Ce fichier

## 🔧 Configuration Firebase

### Services activés
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ App Hosting
- ✅ Analytics (optionnel)

### Collections Firestore
- `orders` - Commandes clients
- `users` - Profils utilisateurs
- `newsletter` - Abonnés newsletter
- `messages` - Messages de contact

## 📖 Documentation

Pour plus d'informations sur la configuration et les fonctionnalités :
- [README-FIREBASE.md](README-FIREBASE.md) - Guide complet Firebase
- [FIREBASE-SETUP.md](FIREBASE-SETUP.md) - Configuration détaillée

## 🛡️ Sécurité

- Authentification sécurisée Firebase Auth
- Règles Firestore pour protéger les données
- HTTPS obligatoire en production
- Pas de stockage de données bancaires (intégration paiement externe requise)

## 📝 License

© 2024 DubaiNegoce. Tous droits réservés.
