// src/services/trackingService.js
const { query } = require('../config/database');

// Rooms actives : bookingId → { barbierId, clientId, startedAt }
const activeRooms = new Map();

const initTracking = (io) => {

  io.on('connection', (socket) => {
    const { userId, role, bookingId } = socket.handshake.auth;
    if (!userId) { socket.disconnect(); return; }

    console.log(`[Tracking] Connexion — ${role} ${userId} (booking: ${bookingId || 'aucun'})`);

    // ── Rejoindre la room de tracking ────────────────
    socket.on('join_tracking', async ({ bookingId: bId }) => {
      try {
        const { rows } = await query(
          `SELECT b.client_id, bar.user_id AS barbier_user_id, b.status
           FROM bookings b
           JOIN barbiers bar ON bar.id = b.barbier_id
           WHERE b.id = $1`,
          [bId]
        );
        if (!rows.length) return;
        const booking = rows[0];

        const allowed = userId === booking.client_id || userId === booking.barbier_user_id;
        if (!allowed) return;

        socket.join(`tracking:${bId}`);
        socket.data.bookingId = bId;
        console.log(`[Tracking] ${role} rejoint room tracking:${bId}`);

        // Envoyer la dernière position connue si elle existe
        const { rows: lastPos } = await query(
          `SELECT lat, lng, recorded_at FROM tracking_positions
           WHERE booking_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
          [bId]
        );
        if (lastPos.length) {
          socket.emit('position_update', {
            lat: parseFloat(lastPos[0].lat),
            lng: parseFloat(lastPos[0].lng),
            recordedAt: lastPos[0].recorded_at,
          });
        }
      } catch (err) {
        console.error('[Tracking] join_tracking:', err.message);
      }
    });

    // ── Barbier envoie sa position ────────────────────
    socket.on('send_position', async ({ lat, lng }) => {
      const bId = socket.data.bookingId;
      if (!bId || role !== 'barber') return;

      try {
        // Vérifier que le tracking est autorisé (booking actif + 30min avant RDV)
        const { rows } = await query(
          `SELECT status, booking_date, booking_time FROM bookings WHERE id = $1`,
          [bId]
        );
        if (!rows.length) return;
        const booking = rows[0];

        const allowedStatuses = ['en_route', 'tracking_active', 'arrived', 'in_progress'];
        if (!allowedStatuses.includes(booking.status)) return;

        // Sauvegarder en DB (dernières 100 positions par booking)
        await query(
          `INSERT INTO tracking_positions (booking_id, barbier_id, lat, lng)
           SELECT $1, bar.id, $2, $3 FROM barbiers bar WHERE bar.user_id = $4`,
          [bId, lat, lng, userId]
        );

        // Diffuser à tous dans la room (client + barbier)
        io.to(`tracking:${bId}`).emit('position_update', {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          recordedAt: new Date().toISOString(),
        });

        // Auto-activer le tracking si en_route et proche (< 30min)
        if (booking.status === 'en_route') {
          const rdvDt = new Date(`${booking.booking_date}T${booking.booking_time}`);
          const msUntil = rdvDt - Date.now();
          if (msUntil <= 30 * 60 * 1000 && msUntil > 0) {
            await query(
              `UPDATE bookings SET status = 'tracking_active' WHERE id = $1 AND status = 'en_route'`,
              [bId]
            );
            io.to(`tracking:${bId}`).emit('status_change', { status: 'tracking_active' });
          }
        }
      } catch (err) {
        console.error('[Tracking] send_position:', err.message);
      }
    });

    // ── Changement de statut en temps réel ────────────
    socket.on('status_update', ({ bookingId: bId, status }) => {
      io.to(`tracking:${bId}`).emit('status_change', { status });
    });

    // ── ETA mis à jour ────────────────────────────────
    socket.on('eta_update', ({ bookingId: bId, etaMinutes, distanceKm }) => {
      io.to(`tracking:${bId}`).emit('eta_update', { etaMinutes, distanceKm });
    });

    socket.on('disconnect', () => {
      console.log(`[Tracking] Déconnexion — ${role} ${userId}`);
    });
  });
};

// Désactiver tous les trackings actifs (tâche CRON 1x/h)
const cleanupOldTrackings = async () => {
  try {
    await query(`
      DELETE FROM tracking_positions
      WHERE recorded_at < NOW() - INTERVAL '24 hours'
    `);
  } catch (err) {
    console.error('[Tracking] cleanup:', err.message);
  }
};

module.exports = { initTracking, cleanupOldTrackings };
