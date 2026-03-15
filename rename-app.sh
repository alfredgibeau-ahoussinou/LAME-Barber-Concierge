#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Script de renommage de l'app
#  Usage : ./rename-app.sh LAME "Lame Barber" com.lame.barber
#  Arg 1 : Nom court (ex: LAME)
#  Arg 2 : Nom complet (ex: "Lame Barber")
#  Arg 3 : Bundle ID (ex: com.lame.barber)
# ═══════════════════════════════════════════════════════════════

set -e

OLD_SHORT="BladeBarber"
OLD_FULL="blade-barber"
OLD_BUNDLE="com.blade.barber"
OLD_SCHEME="BladeBarber"

NEW_SHORT="${1:-LAME}"
NEW_FULL="${2:-Lame Barber}"
NEW_BUNDLE="${3:-com.lame.barber}"
NEW_SCHEME="${NEW_SHORT}"

GOLD='\033[0;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${GOLD}🪒  Renommage : $OLD_SHORT → $NEW_SHORT${NC}"
echo -e "    Bundle : $OLD_BUNDLE → $NEW_BUNDLE"
echo ""

# ── 1. Renommer les dossiers Xcode ────────────────────────────
echo -e "${BLUE}[1/5] Renommage des dossiers Xcode...${NC}"

if [ -d "ios/$OLD_SHORT" ]; then
  mv "ios/$OLD_SHORT" "ios/$NEW_SHORT"
  echo -e "${GREEN}✓ ios/$OLD_SHORT → ios/$NEW_SHORT${NC}"
fi

if [ -d "ios/${OLD_SHORT}Tests" ]; then
  mv "ios/${OLD_SHORT}Tests" "ios/${NEW_SHORT}Tests"
  echo -e "${GREEN}✓ ios/${OLD_SHORT}Tests → ios/${NEW_SHORT}Tests${NC}"
fi

# ── 2. Remplacer dans les fichiers Xcode ──────────────────────
echo -e "${BLUE}[2/5] Mise à jour des fichiers .xcodeproj...${NC}"

find ios -type f \( -name "*.pbxproj" -o -name "*.xcscheme" -o -name "*.plist" -o -name "*.xcworkspacedata" \) | while read f; do
  sed -i '' \
    -e "s/$OLD_BUNDLE/$NEW_BUNDLE/g" \
    -e "s/$OLD_SHORT/$NEW_SHORT/g" \
    -e "s/$OLD_SCHEME/$NEW_SCHEME/g" \
    "$f" 2>/dev/null || true
done
echo -e "${GREEN}✓ Fichiers Xcode mis à jour${NC}"

# ── 3. Renommer le .xcodeproj ─────────────────────────────────
echo -e "${BLUE}[3/5] Renommage du projet Xcode...${NC}"
if [ -d "ios/$OLD_SHORT.xcodeproj" ]; then
  mv "ios/$OLD_SHORT.xcodeproj" "ios/$NEW_SHORT.xcodeproj"
  echo -e "${GREEN}✓ $OLD_SHORT.xcodeproj → $NEW_SHORT.xcodeproj${NC}"
fi
if [ -d "ios/$OLD_SHORT.xcworkspace" ]; then
  mv "ios/$OLD_SHORT.xcworkspace" "ios/$NEW_SHORT.xcworkspace"
fi

# ── 4. Mettre à jour package.json ────────────────────────────
echo -e "${BLUE}[4/5] Mise à jour package.json...${NC}"
sed -i '' "s/\"name\": \"$OLD_FULL\"/\"name\": \"$NEW_FULL\"/g" package.json 2>/dev/null || true
sed -i '' "s/\"$OLD_FULL\"/\"$NEW_FULL\"/g" package.json 2>/dev/null || true
echo -e "${GREEN}✓ package.json mis à jour${NC}"

# ── 5. Mettre à jour app.json ─────────────────────────────────
echo -e "${BLUE}[5/5] Mise à jour app.json...${NC}"
if [ -f "app.json" ]; then
  sed -i '' \
    -e "s/$OLD_SHORT/$NEW_SHORT/g" \
    -e "s/$OLD_FULL/$NEW_FULL/g" \
    app.json
  echo -e "${GREEN}✓ app.json mis à jour${NC}"
fi

echo ""
echo -e "${GREEN}✓ Renommage terminé : $NEW_SHORT ($NEW_BUNDLE)${NC}"
echo ""
echo -e "${GOLD}  Étapes manuelles restantes dans Xcode :${NC}"
echo "  1. Ouvrir ios/$NEW_SHORT.xcworkspace"
echo "  2. Sélectionner le projet en haut à gauche"
echo "  3. Onglet 'General' → 'Display Name' : $NEW_FULL"
echo "  4. Onglet 'Signing & Capabilities' → Bundle ID : $NEW_BUNDLE"
echo ""
echo -e "${GOLD}  Puis relancer :${NC}"
echo "  cd ios && pod install && cd .."
echo "  npx react-native run-ios"
echo ""
