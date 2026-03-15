// src/controllers/bookingsController.js
const { query } = require('../config/database');
const { sendPush } = require('../services/notifService');

// ── Créer une réservation ────────────────────────────
const create = async (req, res) => {
  try {
    const { barbierId, serviceId, slotId, location, context, notes } = req.body;
    const clientId = req.user.id;

    // Récupérer les infos du service
    const { rows: svc } = await query('SELECT name, duration_min, base_price FROM services WHERE id = $1', [serviceId]);
    if (!svc.length) return res.status(404).json({ error: 'Service introuvable' });

    // Vérifier le slot disponible
    const { rows: slot } = await query(
      'SELECT id, slot_date, slot_time FROM slots WHERE id = $1 AND is_booked = FALSE AND barbier_id = $2',
      [slotId, barbierId]
    );
    if (!slot.length) return res.status(409).json({ error: 'Créneau non disponible' });

    // Créer la réservation
    const { rows } = await query(`
      INSERT INTO bookings
        (client_id, barbier_id, slot_id, service_name, duration_min, price_cents,
         location, context, status, booking_date, booking_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10, $11)
      RETURNING *
    `, [clientId, barbierId, slotId, svc[0].name, svc[0].duration_min, svc[0].base_price,
        location, context, slot[0].slot_date, slot[0].slot_time, notes]);

    // Bloquer le slot
    await query('UPDATE slots SET is_booked = TRUE WHERE id = $1', [slotId]);

    res.status(201).json({ booking: rows[0] });
  } catch (err) {
    console.error('[Bookings] create:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Mes réservations (client) ────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    let sql = `
      SELECT b.*, u.first_name AS barbier_fname, u.last_name AS barbier_lname,
             u.avatar_url AS barbier_avatar,
             r.rating AS review_rating, r.comment AS review_comment
      FROM bookings b
      JOIN barbiers bar ON bar.id = b.barbier_id
      JOIN users u ON u.id = bar.user_id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE b.client_id = $1
    `;
    const params = [req.user.id];
    if (status) { params.push(status); sql += ` AND b.status = $${params.length}`; }
    sql += ` ORDER BY b.booking_date DESC, b.booking_time DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await query(sql, params);
    res.json({ bookings: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Missions du barbier ──────────────────────────────
const getBarberMissions = async (req, res) => {
  try {
    const { rows: barb } = await query('SELECT id FROM barbiers WHERE user_id = $1', [req.user.id]);
    if (!barb.length) return res.status(404).json({ error: 'Profil barbier introuvable' });

    const { rows } = await query(`
      SELECT b.*, u.first_name AS client_fname, u.last_name AS client_lname,
             u.phone AS client_phone, u.avatar_url AS client_avatar
      FROM bookings b
      JOIN users u ON u.id = b.client_id
      WHERE b.barbier_id = $1
      AND b.status NOT IN ('cancelled','refunded')
      ORDER BY b.booking_date ASC, b.booking_time ASC
    `, [barb[0].id]);

    res.json({ missions: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Machine à états — transition générique ────────────
const TRANSITIONS = {
  confirmed:        { from: ['pending'],         role: 'system' },
  validated:        { from: ['confirmed'],        role: 'barber' },
  en_route:         { from: ['validated'],        role: 'barber' },
  tracking_active:  { from: ['en_route'],         role: 'system' },
  arrived:          { from: ['tracking_active'],  role: 'barber' },
  in_progress:      { from: ['arrived'],          role: 'barber' },
  completed:        { from: ['in_progress'],      role: 'barber' },
  cancelled:        { from: ['pending','confirmed','validated'], role: 'any' },
};

const transitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transition = TRANSITIONS[status];
    if (!transition) return res.status(400).json({ error: 'Transition invalide' });

    const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Réservation introuvable' });
    const booking = rows[0];

    // Vérifier l'autorisation
    if (transition.role === 'barber') {
      const { rows: barb } = await query('SELECT id FROM barbiers WHERE user_id = $1', [req.user.id]);
      if (!barb.length || barb[0].id !== booking.barbier_id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
    } else if (transition.role === 'any') {
      if (req.user.id !== booking.client_id) {
        const { rows: barb } = await query('SELECT id FROM barbiers WHERE user_id = $1', [req.user.id]);
        if (!barb.length || barb[0].id !== booking.barbier_id) {
          return res.status(403).json({ error: 'Non autorisé' });
        }
      }
    }

    if (!transition.from.includes(booking.status)) {
      return res.status(409).json({
        error: `Impossible de passer de '${booking.status}' à '${status}'`
      });
    }

    const { rows: updated } = await query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Envoyer les notifications push selon la transition
    await _notifyTransition(status, booking);

    res.json({ booking: updated[0] });
  } catch (err) {
    console.error('[Bookings] transition:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Annuler ───────────────────────────────────────────
const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Réservation introuvable' });

    const booking = rows[0];
    if (!['pending','confirmed','validated'].includes(booking.status)) {
      return res.status(409).json({ error: 'Impossible d\'annuler à ce stade' });
    }

    const cancelledBy = req.user.id === booking.client_id ? 'client' : 'barber';
    await query(`
      UPDATE bookings SET status = 'cancelled', cancelled_by = $1, cancel_reason = $2 WHERE id = $3
    `, [cancelledBy, reason, id]);

    // Libérer le slot
    if (booking.slot_id) {
      await query('UPDATE slots SET is_booked = FALSE WHERE id = $1', [booking.slot_id]);
    }

    res.json({ message: 'Réservation annulée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Notifications internes ────────────────────────────
async function _notifyTransition(status, booking) {
  try {
    const NOTIFS = {
      confirmed:       { userId: booking.client_id,  title: 'Paiement confirmé',      body: 'Votre réservation est confirmée.' },
      validated:       { userId: booking.client_id,  title: 'Barbier accepté',        body: 'Votre barbier a validé la mission.' },
      en_route:        { userId: booking.client_id,  title: 'Barbier en route',        body: 'Votre barbier se déplace vers vous.' },
      tracking_active: { userId: booking.client_id,  title: 'Tracking activé',         body: 'Suivez votre barbier en temps réel.' },
      arrived:         { userId: booking.client_id,  title: 'Barbier arrivé',          body: 'Votre barbier est sur place.' },
      completed:       { userId: booking.client_id,  title: 'Prestation terminée',     body: 'Laissez votre avis !' },
      cancelled:       { userId: booking.client_id,  title: 'Réservation annulée',     body: 'Votre réservation a été annulée.' },
    };
    const notif = NOTIFS[status];
    if (!notif) return;

    await query(`
      INSERT INTO notifications (user_id, title, body, type, booking_id)
      VALUES ($1, $2, $3, 'booking', $4)
    `, [notif.userId, notif.title, notif.body, booking.id]);

    await sendPush(notif.userId, notif.title, notif.body);
  } catch (err) {
    console.error('[Bookings] _notifyTransition:', err.message);
  }
}

module.exports = { create, getMyBookings, getBarberMissions, transitionStatus, cancel };
