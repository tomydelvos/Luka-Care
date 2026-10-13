-- Skema awal LukaCare. Semua waktu disimpan sebagai ISO 8601 (UTC).
-- Foto tidak disimpan di D1: kolom *_key menunjuk objek di bucket R2 privat.

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  consent_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

-- Token sesi disimpan sebagai hash SHA-256; token aslinya hanya dipegang klien.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

CREATE TABLE wounds (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,
  area       TEXT,
  condition  TEXT,
  size       TEXT,
  who        TEXT,
  diabetes   INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'dipantau',
  created_at TEXT NOT NULL,
  healed_at  TEXT
);
CREATE INDEX wounds_user ON wounds(user_id, created_at);

-- Catatan harian (Checkin di frontend).
CREATE TABLE wound_examinations (
  id               TEXT PRIMARY KEY,
  wound_id         TEXT NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  at               TEXT NOT NULL,
  photo_key        TEXT,
  pain             INTEGER NOT NULL,
  redness          TEXT NOT NULL,
  fluid            TEXT NOT NULL,
  swelling         INTEGER NOT NULL DEFAULT 0,
  fever            INTEGER NOT NULL DEFAULT 0,
  dressing_changed INTEGER NOT NULL DEFAULT 0,
  note             TEXT NOT NULL DEFAULT ''
);
CREATE INDEX wound_examinations_wound ON wound_examinations(wound_id, at);

-- Galeri foto per luka (maks. 3, dibatasi di Worker).
CREATE TABLE wound_photos (
  id        TEXT PRIMARY KEY,
  wound_id  TEXT NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  photo_key TEXT NOT NULL,
  at        TEXT NOT NULL
);
CREATE INDEX wound_photos_wound ON wound_photos(wound_id, at);
