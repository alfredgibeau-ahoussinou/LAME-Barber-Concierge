// src/services/notifService.js
const apn = require('node-apn');
const { query } = require('../config/database');

let apnProvider = null;

const initAPNs = () => {
  try {
    apnProvider = new apn.Provider({
      token: {
        key:  process.env.APN_KEY_PATH  || './certs/AuthKey.p8',
        keyId: process.env.APN_KEY_ID,
        teamId: process.env.APN_TEAM_ID,
      },
      production: process.env.APN_PRODUCTION === 'true',
    });
    console.log('[APNs] Provider initialisé');
  } catch (err) {
    console.warn('[APNs] Initialisation impossible:', err.message, '(push désactivé)');
  }
};

// ── Envoyer un push à un utilisateur ─────────────────
const sendPush = async (userId, title, body, data = {}) => {
  if (!apnProvider) return;
  try {
    const { rows } = await query(
      'SELECT push_token FROM users WHERE id = $1 AND push_token IS NOT NULL',
      [userId]
    );
    if (!rows.length) return;

    const notification = new apn.Notification();
    notification.expiry = Math.floor(Date.now() / 1000) + 3600;
    notification.badge = 1;
    notification.sound = 'default';
    notification.alert = { title, body };
    notification.topic = process.env.APN_BUNDLE_ID || 'com.blade.barber';
    notification.payload = { data };

    const result = await apnProvider.send(notification, rows[0].push_token);
    if (result.failed.length) {
      console.warn('[APNs] Échec push:', result.failed[0].response?.reason);
      // Token invalide — le supprimer
      if (result.failed[0].response?.reason === 'BadDeviceToken') {
        await query('UPDATE users SET push_token = NULL WHERE id = $1', [userId]);
      }
    }
  } catch (err) {
    console.error('[APNs] sendPush:', err.message);
  }
};

// ── Push groupé (ex: rappel 24h avant RDV) ───────────
const sendBulkPush = async (userIds, title, body, data = {}) => {
  await Promise.allSettled(userIds.map(id => sendPush(id, title, body, data)));
};

// ── Scheduler — rappels automatiques ─────────────────
// À appeler via un CRON toutes les 30 minutes
const scheduleReminders = async () => {
  try {
    // Rappel 24h avant
    const { rows: tomorrow } = await query(`
      SELECT b.id, b.client_id, b.booking_date, b.booking_time,
             u.first_name AS barber_fname
      FROM bookings b
      JOIN barbiers bar ON bar.id = b.barbier_id
      JOIN users u ON u.id = bar.user_id
      WHERE b.status IN ('confirmed','validated')
      AND b.booking_date = CURRENT_DATE + INTERVAL '1 day'
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.booking_id = b.id AND n.title LIKE '%rappel%'
      )
    `);

    for (const rdv of tomorrow) {
      await query(`
        INSERT INTO notifications (user_id, title, body, type, booking_id)
        VALUES ($1, 'Rappel RDV demain', $2, 'reminder', $3)
      `, [rdv.client_id,
          `N'oubliez pas votre RDV demain à ${rdv.booking_time.slice(0,5)} avec ${rdv.barber_fname}`,
          rdv.id]);
      await sendPush(rdv.client_id, 'Rappel RDV demain',
        `Votre RDV est demain à ${rdv.booking_time.slice(0,5)}`);
    }

    // Activer le tracking 30min avant
    const { rows: soon } = await query(`
      SELECT b.id, b.barbier_id
      FROM bookings b
      JOIN barbiers bar ON bar.id = b.barbier_id
      WHERE b.status = 'en_route'
      AND (b.booking_date + b.booking_time::time)
          BETWEEN NOW() AND NOW() + INTERVAL '30 minutes'
    `);

    for (const b of soon) {
      await query(
        `UPDATE bookings SET status = 'tracking_active' WHERE id = $1 AND status = 'en_route'`,
        [b.id]
      );
    }

    if (tomorrow.length + soon.length > 0) {
      console.log(`[Scheduler] ${tomorrow.length} rappels, ${soon.length} trackings activés`);
    }
  } catch (err) {
    console.error('[Scheduler] scheduleReminders:', err.message);
  }
};

module.exports = { initAPNs, sendPush, sendBulkPush, scheduleReminders };
