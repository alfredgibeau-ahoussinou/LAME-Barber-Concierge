// src/controllers/reviewsController.js
const { query } = require('../config/database');

const create = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const clientId = req.user.id;

    const { rows: booking } = await query(
      `SELECT b.* FROM bookings b WHERE b.id = $1 AND b.client_id = $2 AND b.status = 'completed'`,
      [bookingId, clientId]
    );
    if (!booking.length) return res.status(404).json({ error: 'Réservation introuvable ou non terminée' });

    const exists = await query('SELECT id FROM reviews WHERE booking_id = $1', [bookingId]);
    if (exists.rows.length) return res.status(409).json({ error: 'Avis déjà soumis' });

    const { rows } = await query(`
      INSERT INTO reviews (booking_id, client_id, barbier_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [bookingId, clientId, booking[0].barbier_id, rating, comment]);

    // Recalculer la note moyenne du barbier
    await query(`
      UPDATE barbiers SET
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE barbier_id = $1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE barbier_id = $1)
      WHERE id = $1
    `, [booking[0].barbier_id]);

    // Points de fidélité (+50 pour un avis)
    await query('UPDATE users SET loyalty_pts = loyalty_pts + 50 WHERE id = $1', [clientId]);

    res.status(201).json({ review: rows[0] });
  } catch (err) {
    console.error('[Reviews] create:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { create };


// ════════════════════════════════════════════════════════
// src/controllers/notificationsController.js
// ════════════════════════════════════════════════════════
const notifQuery = require('../config/database').query;

const getAll_notif = async (req, res) => {
  try {
    const { rows } = await notifQuery(`
      SELECT * FROM notifications WHERE user_id = $1
      ORDER BY created_at DESC LIMIT 50
    `, [req.user.id]);
    const unread = rows.filter(n => !n.is_read).length;
    res.json({ notifications: rows, unreadCount: unread });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const markRead = async (req, res) => {
  try {
    await notifQuery(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Lu' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await notifQuery('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Tout lu' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const registerPushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;
    await notifQuery('UPDATE users SET push_token = $1 WHERE id = $2', [pushToken, req.user.id]);
    res.json({ message: 'Token enregistré' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const notifController = { getAll: getAll_notif, markRead, markAllRead, registerPushToken };


// ════════════════════════════════════════════════════════
// src/controllers/profileController.js
// ════════════════════════════════════════════════════════
const profQuery = require('../config/database').query;

const getMe = async (req, res) => {
  try {
    const { rows } = await profQuery(`
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.phone,
        u.role, u.avatar_url, u.loyalty_pts, u.member_tier, u.created_at,
        CASE WHEN u.role = 'barber' THEN
          jsonb_build_object(
            'id', b.id, 'rating', b.rating, 'reviewCount', b.review_count,
            'available', b.available, 'experience', b.experience, 'specialities', b.specialities
          )
        ELSE NULL END AS barbier_profile
      FROM users u
      LEFT JOIN barbiers b ON b.user_id = u.id
      WHERE u.id = $1
    `, [req.user.id]);

    if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });

    // Récupérer les stats
    const { rows: stats } = await profQuery(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'completed') AS total_bookings,
        COALESCE(SUM(price_cents) FILTER (WHERE status = 'completed'), 0) AS total_spent
      FROM bookings WHERE client_id = $1
    `, [req.user.id]);

    res.json({ user: rows[0], stats: stats[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const update = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const { rows } = await profQuery(`
      UPDATE users SET first_name = COALESCE($1, first_name),
                       last_name  = COALESCE($2, last_name),
                       phone      = COALESCE($3, phone)
      WHERE id = $4
      RETURNING id, first_name, last_name, email, phone
    `, [firstName, lastName, phone, req.user.id]);
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getLoyalty = async (req, res) => {
  try {
    const { rows } = await profQuery(
      'SELECT loyalty_pts, member_tier FROM users WHERE id = $1',
      [req.user.id]
    );
    const pts = rows[0].loyalty_pts;
    const nextTier = pts < 1300 ? { name: 'Platinum', required: 1300 } : { name: 'VIP', required: 2500 };
    res.json({ points: pts, tier: rows[0].member_tier, nextTier, progress: Math.min(pts / nextTier.required, 1) });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const profileController = { getMe, update, getLoyalty };

module.exports = { create, notifController, profileController };
