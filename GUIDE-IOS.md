# 🪒 LAME — Guide : Lancer sur simulateur iOS

> Suit ce guide dans l'ordre. Temps total estimé : **20–30 minutes**.

---

## Étape 1 — Créer le projet React Native

```bash
# Dans le terminal, choisis un dossier de travail
cd ~/Documents

# Créer le projet (utilise le nom que tu as choisi)
npx react-native@0.73 init LAME --template react-native-template-typescript

# Aller dans le dossier
cd LAME
```

---

## Étape 2 — Copier les fichiers du projet

Copie tous les fichiers du dossier `blade-rn` dans le projet que tu viens de créer :

```bash
# Remplace /chemin/vers/blade-rn par le vrai chemin
cp -r /chemin/vers/blade-rn/src ./src
cp /chemin/vers/blade-rn/App.tsx ./App.tsx
cp /chemin/vers/blade-rn/package.json ./package.json
cp /chemin/vers/blade-rn/tsconfig.json ./tsconfig.json
cp /chemin/vers/blade-rn/babel.config.js ./babel.config.js
```

---

## Étape 3 — Renommer l'app

```bash
# Copier le script de renommage
cp /chemin/vers/blade-setup/scripts/rename-app.sh .
chmod +x rename-app.sh

# Lancer le renommage (adapter selon ton nom)
./rename-app.sh LAME "Lame Barber" com.lame.barber
```

---

## Étape 4 — Installer les fonts

### Télécharger les fonts (manuellement si le script échoue)

Va sur ces liens et télécharge les fichiers `.ttf` :

| Font | Lien |
|---|---|
| Cormorant Garamond Light | https://fonts.google.com/specimen/Cormorant+Garamond |
| DM Sans Regular | https://fonts.google.com/specimen/DM+Sans |
| DM Sans Medium | https://fonts.google.com/specimen/DM+Sans |

### Copier dans le projet

```bash
# Créer le dossier Fonts
mkdir -p ios/LAME/Fonts

# Copier les .ttf téléchargés
cp ~/Downloads/CormorantGaramond-Light.ttf ios/LAME/Fonts/
cp ~/Downloads/CormorantGaramond-Regular.ttf ios/LAME/Fonts/
cp ~/Downloads/DMSans-Regular.ttf ios/LAME/Fonts/
cp ~/Downloads/DMSans-Medium.ttf ios/LAME/Fonts/
```

### Ajouter dans Xcode

1. Ouvre **Xcode** → `ios/LAME.xcworkspace`
2. Dans le panneau gauche, clique droit sur le dossier **LAME**
3. **"Add Files to LAME..."**
4. Navigue vers `ios/LAME/Fonts/`
5. Sélectionne **tous les .ttf**
6. Coche **"Add to target: LAME"** ✓
7. Clique **Add**

### Vérifier dans Info.plist

Ouvre `ios/LAME/Info.plist` et vérifie que cette section est présente :

```xml
<key>UIAppFonts</key>
<array>
    <string>CormorantGaramond-Light.ttf</string>
    <string>CormorantGaramond-Regular.ttf</string>
    <string>DMSans-Regular.ttf</string>
    <string>DMSans-Medium.ttf</string>
</array>
```

> Le fichier `Info.plist` complet est dans `blade-setup/xcode-config/Info.plist` — copie-le directement.

---

## Étape 5 — Installer les dépendances

```bash
# Dépendances npm
npm install

# Pods iOS
cd ios && pod install && cd ..
```

Si `pod install` échoue :
```bash
# Mettre à jour les specs
pod repo update
pod install
```

---

## Étape 6 — Lancer Metro (bundler)

**Terminal 1 :**
```bash
npx react-native start --reset-cache
```

Attends de voir :
```
Metro waiting on exp://...
```

---

## Étape 7 — Lancer sur simulateur

**Terminal 2 :**
```bash
# iPhone 15 Pro (recommandé)
npx react-native run-ios --simulator="iPhone 15 Pro"

# Ou iPhone 14
npx react-native run-ios --simulator="iPhone 14"

# Voir tous les simulateurs disponibles
xcrun simctl list devices available | grep iPhone
```

L'app va compiler (~2-3 min la première fois) et s'ouvrir automatiquement sur le simulateur.

---

## Raccourcis simulateur

| Raccourci | Action |
|---|---|
| `Cmd + R` | Recharger l'app |
| `Cmd + D` | Ouvrir le menu développeur |
| `Cmd + Shift + H` | Bouton Home |
| `Cmd + Shift + A` | Activer Dark Mode |

---

## Problèmes fréquents

### "Unable to boot device"
```bash
# Fermer et relancer le simulateur
xcrun simctl shutdown all
xcrun simctl erase all
npx react-native run-ios
```

### "Build failed — Module not found"
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

### "Font not found" (crash au lancement)
- Vérifie que les .ttf sont bien dans Xcode (étape 4)
- Vérifie que les noms dans `Info.plist` correspondent **exactement** aux noms des fichiers

### Metro port déjà utilisé
```bash
# Tuer le processus sur le port 8081
lsof -ti:8081 | xargs kill -9
npx react-native start
```

### Pods en erreur
```bash
cd ios
pod deintegrate
pod install --repo-update
cd ..
```

---

## Étape suivante : brancher le backend

Une fois l'app qui tourne sur le simulateur :

```bash
# Lancer le backend en local
cd blade-barber-api
npm install
createdb blade_barber
npm run migrate
npm run dev
# → API disponible sur http://localhost:3000
```

Puis dans `src/utils/api.ts`, vérifie que `BASE_URL` pointe sur `http://localhost:3000/api`.

---

*LAME v1.0.0 — Guide de démarrage iOS*
