// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = $1 AND is_active = TRUE',
      [decoded.userId]
    );
    if (!rows.length) return res.status(401).json({ error: 'Utilisateur introuvable' });
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expiré' });
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  next();
};

module.exports = { auth, requireRole };
