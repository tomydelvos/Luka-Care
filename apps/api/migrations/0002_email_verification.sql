-- Verifikasi email: akun baru baru bisa masuk setelah memasukkan kode 6 digit dari email.
-- Akun yang sudah ada sebelum migrasi ini dianggap sudah terverifikasi.
ALTER TABLE users ADD COLUMN email_verified_at TEXT;
UPDATE users SET email_verified_at = created_at;

-- Satu kode aktif per akun. Kode disimpan sebagai hash; kode aslinya hanya dikirim lewat email.
CREATE TABLE email_verifications (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code_hash  TEXT NOT NULL,
  sent_at    TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts   INTEGER NOT NULL DEFAULT 0
);
