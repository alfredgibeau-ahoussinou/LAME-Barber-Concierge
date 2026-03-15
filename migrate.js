// src/utils/migrate.js
require('dotenv').config();
const { pool } = require('../config/database');

const MIGRATION = `
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'barber', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending','confirmed','validated','en_route',
    'tracking_active','arrived','in_progress','completed','cancelled','refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending','succeeded','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notif_type AS ENUM (
    'booking','tracking','payment','reminder','review','system'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── USERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name    VARCHAR(80)  NOT NULL,
  last_name     VARCHAR(80)  NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role          user_role    NOT NULL DEFAULT 'client',
  avatar_url    TEXT,
  loyalty_pts   INTEGER NOT NULL DEFAULT 0,
  member_tier   VARCHAR(20) DEFAULT 'Gold',
  push_token    TEXT,
  refresh_token TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ── BARBIERS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS barbiers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio           TEXT,
  experience    INTEGER DEFAULT 0,
  rating        DECIMAL(3,2) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  specialities  TEXT[] DEFAULT '{}',
  available     BOOLEAN DEFAULT TRUE,
  stripe_account_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_barbiers_user    ON barbiers(user_id);
CREATE INDEX IF NOT EXISTS idx_barbiers_avail   ON barbiers(available);
CREATE INDEX IF NOT EXISTS idx_barbiers_rating  ON barbiers(rating DESC);

-- ── ZONES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbier_id    UUID NOT NULL REFERENCES barbiers(id) ON DELETE CASCADE,
  label         VARCHAR(100) NOT NULL,
  city          VARCHAR(100),
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_zones_barbier ON zones(barbier_id);

-- ── SERVICES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  duration_min  INTEGER NOT NULL,
  base_price    INTEGER NOT NULL,
  active        BOOLEAN DEFAULT TRUE
);

-- ── SLOTS (disponibilités barbier) ───────────────────
CREATE TABLE IF NOT EXISTS slots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbier_id    UUID NOT NULL REFERENCES barbiers(id) ON DELETE CASCADE,
  slot_date     DATE NOT NULL,
  slot_time     TIME NOT NULL,
  is_booked     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_slots_barbier_date ON slots(barbier_id, slot_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_slots_unique ON slots(barbier_id, slot_date, slot_time);

-- ── BOOKINGS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES users(id),
  barbier_id    UUID NOT NULL REFERENCES barbiers(id),
  slot_id       UUID REFERENCES slots(id),
  service_name  VARCHAR(100) NOT NULL,
  duration_min  INTEGER NOT NULL,
  price_cents   INTEGER NOT NULL,
  location      TEXT NOT NULL,
  context       VARCHAR(50),
  status        booking_status NOT NULL DEFAULT 'pending',
  booking_date  DATE NOT NULL,
  booking_time  TIME NOT NULL,
  notes         TEXT,
  cancelled_by  VARCHAR(20),
  cancel_reason TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_client  ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_barbier ON bookings(barbier_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status  ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date    ON bookings(booking_date);

-- ── PAYMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id          UUID NOT NULL REFERENCES bookings(id),
  stripe_intent_id    VARCHAR(255) UNIQUE,
  stripe_transfer_id  VARCHAR(255),
  amount_cents        INTEGER NOT NULL,
  commission_cents    INTEGER DEFAULT 0,
  currency            CHAR(3) DEFAULT 'EUR',
  status              payment_status NOT NULL DEFAULT 'pending',
  paid_at             TIMESTAMPTZ,
  refunded_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe  ON payments(stripe_intent_id);

-- ── REVIEWS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) UNIQUE,
  client_id   UUID NOT NULL REFERENCES users(id),
  barbier_id  UUID NOT NULL REFERENCES barbiers(id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_barbier ON reviews(barbier_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client  ON reviews(client_id);

-- ── NOTIFICATIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  body        TEXT NOT NULL,
  type        notif_type NOT NULL DEFAULT 'system',
  booking_id  UUID REFERENCES bookings(id),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifs_user     ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifs_unread   ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ── TRACKING ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tracking_positions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID NOT NULL REFERENCES bookings(id),
  barbier_id  UUID NOT NULL REFERENCES barbiers(id),
  lat         DECIMAL(10,7) NOT NULL,
  lng         DECIMAL(10,7) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracking_booking ON tracking_positions(booking_id);

-- ── Trigger updated_at auto ───────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated    ON users;
DROP TRIGGER IF EXISTS trg_barbiers_updated ON barbiers;
DROP TRIGGER IF EXISTS trg_bookings_updated ON bookings;

CREATE TRIGGER trg_users_updated    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_barbiers_updated BEFORE UPDATE ON barbiers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Services de base ──────────────────────────────────
INSERT INTO services (name, duration_min, base_price) VALUES
  ('Coupe + Barbe',         45, 8500),
  ('Coupe seule',           30, 5500),
  ('Barbe seule',           30, 4000),
  ('Rasage traditionnel',   30, 4500),
  ('Coupe + Barbe + Soin',  60, 11000)
ON CONFLICT DO NOTHING;
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('[Migration] Démarrage...');
    await client.query(MIGRATION);
    console.log('[Migration] Terminée avec succès ✓');
  } catch (err) {
    console.error('[Migration] Erreur:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
