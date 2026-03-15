#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  BLADE (ou ton nom) — Script de mise en route iOS
#  Lance ce script depuis le dossier racine du projet React Native
#  Usage : chmod +x setup-ios.sh && ./setup-ios.sh
# ═══════════════════════════════════════════════════════════════

set -e  # Arrêter à la première erreur

# ── Couleurs terminal ──────────────────────────────────────────
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── Bannière ───────────────────────────────────────────────────
echo ""
echo -e "${GOLD}  ██████╗  ██╗      █████╗  ██████╗  ███████╗${NC}"
echo -e "${GOLD}  ██╔══██╗ ██║     ██╔══██╗ ██╔══██╗ ██╔════╝${NC}"
echo -e "${GOLD}  ██████╔╝ ██║     ███████║ ██║  ██║ █████╗  ${NC}"
echo -e "${GOLD}  ██╔══██╗ ██║     ██╔══██║ ██║  ██║ ██╔══╝  ${NC}"
echo -e "${GOLD}  ██████╔╝ ███████╗██║  ██║ ██████╔╝ ███████╗${NC}"
echo -e "${GOLD}  ╚═════╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚══════╝${NC}"
echo -e "${GOLD}  Barber Concierge — Setup iOS${NC}"
echo ""

# ── Vérification des prérequis ─────────────────────────────────
echo -e "${BLUE}[1/6] Vérification des prérequis...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js non trouvé. Installe-le sur nodejs.org${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm non trouvé${NC}"; exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

if ! xcode-select -p &> /dev/null; then
  echo -e "${RED}✗ Xcode Command Line Tools non trouvés.${NC}"
  echo "  Lance : xcode-select --install"
  exit 1
fi
echo -e "${GREEN}✓ Xcode Command Line Tools$(NC}"

if ! command -v pod &> /dev/null; then
  echo -e "${GOLD}⚠ CocoaPods non trouvé. Installation...${NC}"
  sudo gem install cocoapods
fi
echo -e "${GREEN}✓ CocoaPods $(pod --version)${NC}"

# ── Installation des dépendances npm ──────────────────────────
echo ""
echo -e "${BLUE}[2/6] Installation des dépendances npm...${NC}"
npm install
echo -e "${GREEN}✓ Dépendances npm installées${NC}"

# ── Installation des pods iOS ──────────────────────────────────
echo ""
echo -e "${BLUE}[3/6] Installation des pods iOS...${NC}"
cd ios
pod install --repo-update
cd ..
echo -e "${GREEN}✓ Pods iOS installés${NC}"

# ── Fonts — téléchargement et copie ───────────────────────────
echo ""
echo -e "${BLUE}[4/6] Configuration des fonts...${NC}"

FONTS_DIR="ios/BladeBarber/Fonts"
mkdir -p "$FONTS_DIR"

echo -e "${GOLD}  Téléchargement de Cormorant Garamond depuis Google Fonts...${NC}"
# Cormorant Garamond Light
curl -sL "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3WmX5slCNuHLi8bLeY9MK7whWMhyjYrEPjuw-NNg.ttf" \
  -o "$FONTS_DIR/CormorantGaramond-Light.ttf" 2>/dev/null || \
  echo -e "${GOLD}  → Téléchargement auto échoué — copie manuelle requise (voir README)${NC}"

# Cormorant Garamond Regular
curl -sL "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrEtPlg.ttf" \
  -o "$FONTS_DIR/CormorantGaramond-Regular.ttf" 2>/dev/null || true

# DM Sans Regular
curl -sL "https://fonts.gstatic.com/s/dmsans/v14/rP2Hp2ywxg089UriCZa4ET-DNl0.ttf" \
  -o "$FONTS_DIR/DMSans-Regular.ttf" 2>/dev/null || true

# DM Sans Medium
curl -sL "https://fonts.gstatic.com/s/dmsans/v14/rP2Cp2ywxg089UriASitCBimCw.ttf" \
  -o "$FONTS_DIR/DMSans-Medium.ttf" 2>/dev/null || true

# Compter les fonts téléchargées
FONT_COUNT=$(ls "$FONTS_DIR"/*.ttf 2>/dev/null | wc -l)
echo -e "${GREEN}✓ $FONT_COUNT fonts dans $FONTS_DIR${NC}"
echo -e "${GOLD}  → Pense à les ajouter dans Xcode (voir étape 5 du README)${NC}"

# ── Variables d'environnement ──────────────────────────────────
echo ""
echo -e "${BLUE}[5/6] Configuration de l'environnement...${NC}"

if [ ! -f ".env" ]; then
  cat > .env << 'EOF'
# BLADE — Variables d'environnement React Native
# Ces variables sont lues par react-native-config

API_URL=http://localhost:3000/api
SOCKET_URL=http://localhost:3000
STRIPE_PUBLISHABLE_KEY=pk_test_REMPLACE_PAR_TA_CLE_STRIPE
GOOGLE_MAPS_KEY=REMPLACE_PAR_TA_CLE_GOOGLE_MAPS
APP_ENV=development
EOF
  echo -e "${GREEN}✓ Fichier .env créé${NC}"
else
  echo -e "${GREEN}✓ .env déjà présent${NC}"
fi

# ── Lancement du simulateur ────────────────────────────────────
echo ""
echo -e "${BLUE}[6/6] Lancement sur simulateur iOS...${NC}"
echo ""
echo -e "${GOLD}  Simulateur disponibles :${NC}"
xcrun simctl list devices available | grep "iPhone" | head -8

echo ""
echo -e "${GREEN}  Lancement sur iPhone 15 Pro...${NC}"
echo ""

# Ouvrir Metro en arrière-plan
npx react-native start --reset-cache &
METRO_PID=$!

# Attendre que Metro soit prêt
sleep 4

# Lancer sur iOS
npx react-native run-ios --simulator="iPhone 15 Pro"

echo ""
echo -e "${GREEN}  ✓ L'app est lancée sur le simulateur !${NC}"
echo ""
echo -e "${GOLD}  Raccourcis utiles :${NC}"
echo "  Cmd+R     → Recharger l'app"
echo "  Cmd+D     → Menu développeur"
echo "  Ctrl+C    → Arrêter Metro"
echo ""
