// react-native.config.js
// Ce fichier permet à React Native de lier automatiquement les fonts
// sans avoir à les ajouter manuellement dans Xcode.
// Place ce fichier à la racine du projet React Native.

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: [
    './src/assets/fonts/',  // Dossier où tu mets les .ttf
  ],
};
