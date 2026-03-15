# BLADE — Barber Concierge · React Native iOS

> Application mobile iOS de conciergerie barbier à domicile.  
> Inspirée d'Uber — pour la coiffure de luxe en privé.

---

## Stack technique

| Technologie | Usage |
|---|---|
| React Native 0.73 | Framework mobile |
| TypeScript | Typage statique |
| React Navigation v6 | Navigation (Stack + Bottom Tabs) |
| Zustand | State management |
| React Native Maps | Carte & tracking GPS |
| Stripe SDK | Paiement |
| Socket.io | Tracking en temps réel |

---

## Structure du projet

```
blade-barber/
├── App.tsx                        # Entrée principale
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Toute la navigation
│   ├── theme/
│   │   └── index.ts               # Couleurs, fonts, spacing
│   ├── components/
│   │   ├── UI.tsx                 # Composants réutilisables
│   │   └── ScreenWrapper.tsx      # Header & BottomTabBar
│   └── screens/
│       ├── auth/
│       │   ├── OnboardingScreen.tsx   # 3 slides d'intro
│       │   ├── LoginScreen.tsx        # Connexion
│       │   └── SignupScreen.tsx       # Inscription 4 étapes
│       ├── client/
│       │   ├── HomeScreen.tsx         # Accueil client
│       │   ├── SearchScreen.tsx       # Recherche + Profil barbier
│       │   └── BookingScreen.tsx      # Réservation / Paiement / Tracking / Avis / Historique
│       ├── barber/
│       │   └── BarberDashboardScreen.tsx  # Dashboard Pro + Admin
│       └── shared/
│           └── NotificationsScreen.tsx    # Notifs / Profil / Settings / Support
```

---

## Flux de navigation

```
Onboarding (3 slides)
    ↓
Login ←→ Signup (4 étapes)
    ↓              ↓
ClientTabs      BarberTabs
  ├── Accueil        ├── Dashboard Pro
  ├── Recherche      └── Admin
  ├── Tracking
  ├── Notifications
  └── Profil
       ├── Paramètres
       ├── Support
       └── Historique
```

---

## Installation & lancement iOS

### Prérequis
- macOS avec Xcode 15+
- Node.js 18+
- CocoaPods
- iOS Simulator ou iPhone physique

### 1. Installer les dépendances

```bash
git clone https://github.com/TON-USERNAME/blade-barber-rn.git
cd blade-barber-rn

npm install
cd ios && pod install && cd ..
```

### 2. Lancer l'app iOS

```bash
npx react-native run-ios
# ou avec simulateur spécifique
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### 3. Metro bundler (si besoin séparé)

```bash
npx react-native start
```

---

## Pages couvertes

| Page | Description |
|---|---|
| Onboarding 1-2-3 | Slides d'introduction avec pagination |
| Connexion | Email / mot de passe + Google / Apple |
| Inscription 1 | Identité (prénom, nom, email, téléphone) |
| Inscription 2 | Profil (Client vs Barbier) + contextes |
| Inscription 3 | Adresse + géolocalisation |
| Inscription 4 | Mot de passe + CGU |
| Accueil | Prochain RDV, barbiers disponibles |
| Recherche | Barre + filtres + résultats |
| Profil Barbier | Fiche détaillée, galerie, prestations |
| Réservation | Service + créneau + lieu |
| Paiement | Visa / Apple Pay / Google Pay |
| Tracking | Carte live, ETA, timeline |
| Avis | Notation + commentaire |
| Historique | Toutes les prestations |
| Notifications | Lues / non-lues |
| Profil | Stats + fidélité Gold |
| Paramètres | Compte + toggles + déconnexion |
| Support | Contacts + FAQ accordéon |
| Barbier Pro | Dashboard + zones + missions |
| Admin | Stats + graphique + activités |

---

## Palettes

- **Or & Noir** — Luxe, palace, VIP (défaut)
- **Noir & Blanc** — Minimaliste élégant
- **Bleu Roi & Or** — Prestige royal

---

## Roadmap v2

- [ ] Intégration Stripe (paiement réel)
- [ ] Intégration Google Maps (carte vraie)
- [ ] WebSocket tracking live
- [ ] Push Notifications (APNs)
- [ ] Authentification Firebase
- [ ] Backend API (Node.js / Express)
- [ ] App Store submission

---

*Projet BLADE — Barber Concierge*
