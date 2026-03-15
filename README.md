# BLADE API — Backend Node.js

> API REST + WebSocket temps réel pour l'app BLADE Barber Concierge.

---

## Stack

| Techno | Usage |
|---|---|
| Node.js + Express | Serveur HTTP |
| PostgreSQL | Base de données principale |
| Socket.io | Tracking GPS temps réel |
| Stripe | Paiement + remboursement |
| Apple APNs | Push notifications iOS |
| JWT | Authentification |
| bcryptjs | Hashage des mots de passe |

---

## Structure

```
src/
├── index.js                    # Entrée principale — Express + Socket.io
├── config/
│   └── database.js             # Pool PostgreSQL
├── middleware/
│   └── auth.js                 # Vérification JWT + rôles
├── routes/
│   └── index.js                # Toutes les routes API
├── controllers/
│   ├── authController.js       # Register, login, refresh, logout
│   ├── barbiersController.js   # Liste, profil, slots, zones
│   ├── bookingsController.js   # Réservations + machine à états
│   ├── paymentsController.js   # Stripe PaymentIntent + webhook
│   └── reviewsController.js    # Avis, notifications, profil
├── services/
│   ├── trackingService.js      # Socket.io GPS temps réel
│   └── notifService.js         # APNs + schedulers
└── utils/
    └── migrate.js              # Création des tables PostgreSQL
```

---

## Installation

```bash
git clone https://github.com/TON-USERNAME/blade-barber-api.git
cd blade-barber-api
npm install

# Copier et remplir le .env
cp .env.example .env

# Créer la base de données
createdb blade_barber

# Lancer les migrations
npm run migrate

# Démarrer en dev
npm run dev
```

---

## Variables d'environnement

Voir `.env.example` — variables requises :
- `DB_*` — connexion PostgreSQL
- `JWT_SECRET` + `JWT_REFRESH_SECRET` — min 32 caractères
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- `APN_KEY_PATH` + `APN_KEY_ID` + `APN_TEAM_ID`

---

## Endpoints

### Auth
| Méthode | Route | Description |
|---|---|---|
| POST | /api/auth/register | Créer un compte |
| POST | /api/auth/login | Se connecter |
| POST | /api/auth/refresh | Rafraîchir le token |
| POST | /api/auth/logout | Se déconnecter |

### Barbiers
| Méthode | Route | Description |
|---|---|---|
| GET | /api/barbiers | Liste avec filtres |
| GET | /api/barbiers/:id | Profil détaillé |
| GET | /api/barbiers/:id/slots?date= | Créneaux disponibles |
| GET | /api/barbiers/:id/reviews | Avis |
| PUT | /api/barbiers/availability | Changer disponibilité |

### Réservations
| Méthode | Route | Description |
|---|---|---|
| POST | /api/bookings | Créer une réservation |
| GET | /api/bookings/me | Mes réservations |
| GET | /api/bookings/missions | Missions du barbier |
| PUT | /api/bookings/:id/status | Changer le statut |
| PUT | /api/bookings/:id/cancel | Annuler |

### Paiements
| Méthode | Route | Description |
|---|---|---|
| POST | /api/payments/intent | Créer PaymentIntent Stripe |
| POST | /api/payments/confirm | Confirmer le paiement |
| POST | /api/payments/refund/:id | Rembourser |
| POST | /api/payments/webhook | Webhook Stripe |

---

## Cycle de vie d'une réservation

```
pending → confirmed (paiement ok)
        → validated (barbier accepte)
        → en_route  (barbier en déplacement)
        → tracking_active (30min avant RDV)
        → arrived   (barbier sur place)
        → in_progress (prestation en cours)
        → completed → reviewed
        → cancelled → refunded
```

---

## WebSocket — Tracking

```javascript
// Connexion depuis l'app mobile
const socket = io('http://localhost:3000', {
  auth: { userId: 'uuid', role: 'client', bookingId: 'uuid' }
});

// Rejoindre la room
socket.emit('join_tracking', { bookingId });

// Recevoir la position du barbier
socket.on('position_update', ({ lat, lng, recordedAt }) => {
  // Mettre à jour le marker sur la carte
});

// Recevoir les changements de statut
socket.on('status_change', ({ status }) => {
  // Mettre à jour l'UI
});

// [Côté barbier] Envoyer sa position
socket.emit('send_position', { lat: 48.8566, lng: 2.3522 });
```

---

## Déploiement (production)

Recommandé : **Railway** ou **Render** (PostgreSQL inclus, gratuit pour démarrer)

```bash
# Variables d'environnement à configurer sur la plateforme
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=3000
# + toutes les autres variables du .env.example
```

---

*BLADE v1.0.0 — Backend API*
