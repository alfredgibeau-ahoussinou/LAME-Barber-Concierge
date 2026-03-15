// src/controllers/paymentsController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query } = require('../config/database');
const { sendPush } = require('../services/notifService');

const COMMISSION = parseFloat(process.env.STRIPE_COMMISSION_PERCENT || 15) / 100;

// ── Créer un PaymentIntent ────────────────────────────
const createIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const { rows } = await query(`
      SELECT b.*, bar.stripe_account_id,
             u_c.email AS client_email
      FROM bookings b
      JOIN barbiers bar ON bar.id = b.barbier_id
      JOIN users u_c ON u_c.id = b.client_id
      WHERE b.id = $1 AND b.client_id = $2 AND b.status = 'pending'
    `, [bookingId, req.user.id]);

    if (!rows.length) return res.status(404).json({ error: 'Réservation introuvable ou déjà payée' });
    const booking = rows[0];

    const intent = await stripe.paymentIntents.create({
      amount: booking.price_cents,
      currency: 'eur',
      customer_email: booking.client_email,
      metadata: { bookingId, clientId: req.user.id },
      automatic_payment_methods: { enabled: true },
    });

    // Sauvegarder l'intent
    await query(`
      INSERT INTO payments (booking_id, stripe_intent_id, amount_cents, commission_cents, status)
      VALUES ($1, $2, $3, $4, 'pending')
      ON CONFLICT (stripe_intent_id) DO NOTHING
    `, [bookingId, intent.id, booking.price_cents, Math.round(booking.price_cents * COMMISSION)]);

    res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (err) {
    console.error('[Payments] createIntent:', err.message);
    res.status(500).json({ error: 'Erreur paiement' });
  }
};

// ── Confirmer paiement ────────────────────────────────
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') {
      return res.status(402).json({ error: 'Paiement non finalisé' });
    }

    await query(`
      UPDATE payments SET status = 'succeeded', paid_at = NOW()
      WHERE stripe_intent_id = $1
    `, [paymentIntentId]);

    await query(`
      UPDATE bookings SET status = 'confirmed' WHERE id = $1
    `, [bookingId]);

    // Notifier le client
    await query(`
      INSERT INTO notifications (user_id, title, body, type, booking_id)
      VALUES ($1, 'Paiement confirmé', 'Votre réservation est confirmée. Le barbier va valider.', 'payment', $2)
    `, [req.user.id, bookingId]);

    // Notifier le barbier
    const { rows } = await query(`
      SELECT bar.user_id FROM bookings b JOIN barbiers bar ON bar.id = b.barbier_id WHERE b.id = $1
    `, [bookingId]);
    if (rows.length) {
      await query(`
        INSERT INTO notifications (user_id, title, body, type, booking_id)
        VALUES ($1, 'Nouvelle mission', 'Un client a réservé. À vous de valider.', 'booking', $2)
      `, [rows[0].user_id, bookingId]);
      await sendPush(rows[0].user_id, 'Nouvelle mission', 'Un client a réservé. À vous de valider.');
    }

    res.json({ message: 'Paiement confirmé', bookingId });
  } catch (err) {
    console.error('[Payments] confirm:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ── Remboursement ─────────────────────────────────────
const refund = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { rows } = await query(`
      SELECT p.*, b.client_id FROM payments p
      JOIN bookings b ON b.id = p.booking_id
      WHERE p.booking_id = $1 AND p.status = 'succeeded'
    `, [bookingId]);

    if (!rows.length) return res.status(404).json({ error: 'Paiement introuvable' });
    if (req.user.id !== rows[0].client_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await stripe.refunds.create({ payment_intent: rows[0].stripe_intent_id });

    await query(`UPDATE payments SET status = 'refunded', refunded_at = NOW() WHERE booking_id = $1`, [bookingId]);
    await query(`UPDATE bookings SET status = 'refunded' WHERE id = $1`, [bookingId]);

    res.json({ message: 'Remboursement effectué' });
  } catch (err) {
    console.error('[Payments] refund:', err.message);
    res.status(500).json({ error: 'Erreur remboursement' });
  }
};

// ── Webhook Stripe ────────────────────────────────────
const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook invalide: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        await query(
          `UPDATE payments SET status = 'succeeded', paid_at = NOW() WHERE stripe_intent_id = $1`,
          [intent.id]
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await query(
          `UPDATE payments SET status = 'failed' WHERE stripe_intent_id = $1`,
          [intent.id]
        );
        if (intent.metadata?.bookingId) {
          await query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
            [intent.metadata.bookingId]
          );
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await query(
          `UPDATE payments SET status = 'refunded', refunded_at = NOW() WHERE stripe_intent_id = $1`,
          [charge.payment_intent]
        );
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook]:', err.message);
    res.status(500).json({ error: 'Erreur traitement webhook' });
  }
};

module.exports = { createIntent, confirmPayment, refund, webhook };
