# 🚀 Guide de Déploiement - DubaiNegoce

## Option 1 : Firebase App Hosting (Recommandé)

### Étapes détaillées :

#### 1. Accéder à Firebase Console
- Ouvrez : https://console.firebase.google.com/project/dubainegoce-495be/apphosting
- Ou : Console Firebase > Sélectionner "dubainegoce-495be" > Menu "App Hosting"

#### 2. Commencer la configuration
- Cliquez sur **"Get started"** (Commencer)
- Si vous voyez "Connect to GitHub", cliquez dessus

#### 3. Autoriser GitHub
- Cliquez sur **"Connect GitHub account"**
- Autorisez Firebase à accéder à votre compte GitHub
- Acceptez les permissions demandées

#### 4. Sélectionner le repository
- Repository : **ouddorient-cpu/dubainegoce**
- Branche : **main**
- Cliquez sur **"Next"** (Suivant)

#### 5. Configuration automatique
Firebase va détecter automatiquement :
- ✅ Output directory : `public/`
- ✅ Configuration : `apphosting.yaml`
- ✅ Runtime : Node.js 20

**Si demandé :**
- Build command : *(laisser vide)*
- Install command : *(laisser vide)*
- Output directory : `public`

#### 6. Déployer
- Cliquez sur **"Deploy"** ou **"Create backend and deploy"**
- Attendez 2-5 minutes

#### 7. Accéder à votre site
Une fois déployé, vous obtiendrez une URL :
- Format : `https://dubainegoce-495be--[hash].web.app`
- Copiez cette URL et testez votre site !

---

## Option 2 : Firebase Hosting (CLI)

### Étapes :

```bash
# 1. Se reconnecter à Firebase
firebase login

# 2. Vérifier le projet
firebase use dubainegoce-495be

# 3. Déployer
firebase deploy --only hosting

# 4. Votre site sera disponible à :
# https://dubainegoce-495be.web.app
# https://dubainegoce-495be.firebaseapp.com
```

---

## Option 3 : Glisser-Déposer (Console Firebase)

Si vous préférez une méthode visuelle :

#### 1. Ouvrir Firebase Hosting
- https://console.firebase.google.com/project/dubainegoce-495be/hosting

#### 2. Déployer manuellement
- Cliquez sur **"Get started"** si c'est la première fois
- Ou cliquez sur **"Deploy to live channel"**
- Sélectionnez **"Deploy from computer"**

#### 3. Uploader les fichiers
- Glissez le dossier `public/` entier
- Ou cliquez pour sélectionner les fichiers
- Firebase uploade automatiquement

#### 4. Terminé !
- Votre site sera en ligne sous : `https://dubainegoce-495be.web.app`

---

## ⚠️ Important : Configuration Firestore

Après le déploiement, activez Firestore pour les commandes :

### 1. Créer la base de données
- Allez sur : https://console.firebase.google.com/project/dubainegoce-495be/firestore
- Cliquez sur **"Créer une base de données"**
- Mode : **Production**
- Location : **europe-west (Belgique)** ou **europe-west1 (Belgique)**
- Cliquez sur **"Créer"**

### 2. Déployer les règles de sécurité

**Option A - Via Console :**
1. Dans Firestore > **Règles**
2. Copiez le contenu de `firestore.rules`
3. Collez et **Publier**

**Option B - Via CLI :**
```bash
firebase deploy --only firestore:rules
```

### 3. Activer Authentication
- Allez sur : https://console.firebase.google.com/project/dubainegoce-495be/authentication
- Onglet **"Sign-in method"**
- Activez **"Email/Password"**
- Sauvegardez

---

## ✅ Checklist Post-Déploiement

Après le déploiement, vérifiez :

- [ ] Site accessible via l'URL Firebase
- [ ] Firestore Database créée et règles déployées
- [ ] Authentication Email/Password activée
- [ ] Tester l'ajout au panier (doit fonctionner)
- [ ] Tester la création de compte
- [ ] Tester une commande test
- [ ] Vérifier que la commande apparaît dans Firestore

---

## 🎨 Personnalisation Future

### Ajouter des images de produits
1. Uploadez vos images sur un service CDN (Cloudinary, ImageKit, etc.)
2. Modifiez `public/js/products-data.js`
3. Remplacez les URLs `https://via.placeholder.com/...`
4. Commit et push sur GitHub (App Hosting redéploie automatiquement)

### Modifier les produits
1. Éditez `public/js/products-data.js`
2. Ajoutez/modifiez/supprimez des parfums
3. Commit et push (déploiement automatique si App Hosting)

### Changer le design
1. Modifiez `public/css/styles-v2.css`
2. Testez localement en ouvrant `public/index.html`
3. Commit et push

---

## 🔗 Liens Utiles

- **Site web** : https://dubainegoce-495be.web.app
- **GitHub** : https://github.com/ouddorient-cpu/dubainegoce
- **Firebase Console** : https://console.firebase.google.com/project/dubainegoce-495be
- **App Hosting** : https://console.firebase.google.com/project/dubainegoce-495be/apphosting
- **Firestore** : https://console.firebase.google.com/project/dubainegoce-495be/firestore
- **Authentication** : https://console.firebase.google.com/project/dubainegoce-495be/authentication

---

## 🆘 Problèmes Courants

### "Project not found" lors du déploiement CLI
**Solution** : Reconnectez-vous avec `firebase login` puis réessayez

### Les commandes ne se créent pas dans Firestore
**Solution** : Vérifiez que Firestore est activé et que les règles sont déployées

### Erreur "Analytics is not available"
**Solution** : Normale si Analytics n'est pas activé. Le site fonctionne quand même.

### Images produits ne s'affichent pas
**Solution** : Les URLs placeholder doivent être remplacées par vos vraies images

---

**Bon déploiement ! 🚀**
