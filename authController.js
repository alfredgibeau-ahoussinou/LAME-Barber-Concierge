// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');

const generateTokens = (userId) => {
  const access = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  const refresh = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
  return { access, refresh };
};

// ── Register ──────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role = 'client' } = req.body;

    const exists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const { rows } = await query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, role, loyalty_pts`,
      [firstName, lastName, email.toLowerCase(), phone, hash, role]
    );
    const user = rows[0];

    // Si barbier, créer le profil barbier
    if (role === 'barber') {
      await query('INSERT INTO barbiers (user_id) VALUES ($1)', [user.id]);
    }

    const { access, refresh } = generateTokens(user.id);
    await query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refresh, user.id]);

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
      tokens: { access, refresh },
    });
  } catch (err) {
    console.error('[Auth] Erreur register:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Login ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query(
      'SELECT id, first_name, last_name, email, role, password_hash, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (!rows.length) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Compte désactivé' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const { access, refresh } = generateTokens(user.id);
    await query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refresh, user.id]);

    res.json({
      user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
      tokens: { access, refresh },
    });
  } catch (err) {
    console.error('[Auth] Erreur login:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Refresh Token ─────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token manquant' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { rows } = await query(
      'SELECT id, role FROM users WHERE id = $1 AND refresh_token = $2 AND is_active = TRUE',
      [decoded.userId, token]
    );
    if (!rows.length) return res.status(401).json({ error: 'Token invalide ou expiré' });

    const { access, refresh } = generateTokens(rows[0].id);
    await query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refresh, rows[0].id]);

    res.json({ tokens: { access, refresh } });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// ── Logout ────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    await query('UPDATE users SET refresh_token = NULL WHERE id = $1', [req.user.id]);
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Forgot Password ───────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    // Ne pas révéler si l'email existe ou non
    if (!rows.length) return res.json({ message: 'Si cet email existe, un lien a été envoyé' });
    // TODO: envoyer email avec token reset
    res.json({ message: 'Si cet email existe, un lien a été envoyé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login, refreshToken, logout, forgotPassword };
