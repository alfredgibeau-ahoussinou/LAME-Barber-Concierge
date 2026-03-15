// src/index.js
require('dotenv').config();
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const routes             = require('./routes');
const { initTracking, cleanupOldTrackings } = require('./services/trackingService');
const { initAPNs, scheduleReminders }       = require('./services/notifService');
const { pool }           = require('./config/database');

const app    = express();
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});
initTracking(io);

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Webhook Stripe doit recevoir le body brut (avant JSON parser)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message:  { error: 'Trop de requêtes, réessayez dans quelques minutes' },
  standardHeaders: true,
  legacyHeaders:   false,
}));

// Rate limiting strict pour l'auth
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives de connexion' },
}));

// ── Routes ────────────────────────────────────────────
app.use('/api', routes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      db: 'connected',
      env: process.env.NODE_ENV,
    });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable: ${req.method} ${req.path}` });
});

// Erreur globale
app.use((err, req, res, next) => {
  console.error('[Server] Erreur non gérée:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ── Démarrage ─────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 3000;

server.listen(PORT, async () => {
  console.log(`\n🪒  BLADE API démarrée sur le port ${PORT}`);
  console.log(`   Mode : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health : http://localhost:${PORT}/health\n`);

  // Init services
  initAPNs();

  // Schedulers (simple setInterval en dev, utiliser un CRON en prod)
  setInterval(scheduleReminders, 30 * 60 * 1000);   // toutes les 30min
  setInterval(cleanupOldTrackings, 60 * 60 * 1000); // toutes les heures
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Server] SIGTERM reçu — arrêt gracieux...');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});

module.exports = { app, server, io };
