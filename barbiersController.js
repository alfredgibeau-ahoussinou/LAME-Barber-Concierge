// src/controllers/barbiersController.js
const { query } = require('../config/database');

// ── Liste des barbiers avec filtres ──────────────────
const getAll = async (req, res) => {
  try {
    const { context, available, zone, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT
        b.id, b.rating, b.review_count, b.experience,
        b.specialities, b.available,
        u.first_name, u.last_name, u.avatar_url,
        array_agg(DISTINCT z.label) FILTER (WHERE z.active) AS zones
      FROM barbiers b
      JOIN users u ON u.id = b.user_id
      LEFT JOIN zones z ON z.barbier_id = b.id
      WHERE u.is_active = TRUE
    `;
    const params = [];

    if (available === 'true') {
      params.push(true);
      sql += ` AND b.available = $${params.length}`;
    }
    if (zone) {
      params.push(`%${zone}%`);
      sql += ` AND EXISTS (SELECT 1 FROM zones z2 WHERE z2.barbier_id = b.id AND z2.label ILIKE $${params.length} AND z2.active = TRUE)`;
    }

    sql += ` GROUP BY b.id, u.first_name, u.last_name, u.avatar_url
             ORDER BY b.rating DESC, b.review_count DESC
             LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await query(sql, params);
    res.json({ barbiers: rows, total: rows.length });
  } catch (err) {
    console.error('[Barbiers] getAll:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Profil détaillé d'un barbier ──────────────────────
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(`
      SELECT
        b.id, b.bio, b.rating, b.review_count, b.experience,
        b.specialities, b.available,
        u.first_name, u.last_name, u.avatar_url, u.phone,
        array_agg(DISTINCT jsonb_build_object('label', z.label, 'active', z.active))
          FILTER (WHERE z.id IS NOT NULL) AS zones
      FROM barbiers b
      JOIN users u ON u.id = b.user_id
      LEFT JOIN zones z ON z.barbier_id = b.id
      WHERE b.id = $1 AND u.is_active = TRUE
      GROUP BY b.id, u.first_name, u.last_name, u.avatar_url, u.phone
    `, [id]);

    if (!rows.length) return res.status(404).json({ error: 'Barbier introuvable' });
    res.json({ barbier: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Créneaux disponibles ──────────────────────────────
const getSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'Paramètre date requis (YYYY-MM-DD)' });

    const { rows } = await query(`
      SELECT id, slot_date, slot_time, is_booked
      FROM slots
      WHERE barbier_id = $1 AND slot_date = $2 AND is_booked = FALSE
      ORDER BY slot_time
    `, [id, date]);

    res.json({ slots: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Avis d'un barbier ────────────────────────────────
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const { rows } = await query(`
      SELECT
        r.id, r.rating, r.comment, r.created_at,
        u.first_name, u.last_name, u.avatar_url
      FROM reviews r
      JOIN users u ON u.id = r.client_id
      WHERE r.barbier_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [id, parseInt(limit), parseInt(offset)]);

    res.json({ reviews: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Mettre à jour disponibilité (barbier) ─────────────
const updateAvailability = async (req, res) => {
  try {
    const { available } = req.body;
    const { rows } = await query(`
      UPDATE barbiers SET available = $1
      WHERE user_id = $2
      RETURNING id, available
    `, [available, req.user.id]);

    if (!rows.length) return res.status(404).json({ error: 'Profil barbier introuvable' });
    res.json({ barbier: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Ajouter / gérer les zones ─────────────────────────
const upsertZone = async (req, res) => {
  try {
    const { label, city, active = true } = req.body;
    const { rows: barb } = await query('SELECT id FROM barbiers WHERE user_id = $1', [req.user.id]);
    if (!barb.length) return res.status(404).json({ error: 'Profil barbier introuvable' });

    const { rows } = await query(`
      INSERT INTO zones (barbier_id, label, city, active)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (barbier_id, label) DO UPDATE SET active = $4, city = $3
      RETURNING *
    `, [barb[0].id, label, city, active]);

    res.status(201).json({ zone: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getAll, getById, getSlots, getReviews, updateAvailability, upsertZone };
