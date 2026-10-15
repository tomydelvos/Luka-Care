-- Tahap 2 M3: catatan harian versi 2 dan rencana pemulihan (docs/prd-tahap-2.md, Lampiran C).
-- Daftar dan objek disimpan sebagai JSON teks. Catatan lama tetap schema = 1 dan dibaca seperti biasa.

ALTER TABLE wounds ADD COLUMN risk TEXT;            -- { perokok, imunLemah }
ALTER TABLE wounds ADD COLUMN healing TEXT;         -- { rowId, checkByDays, evidence } (dihitung di klien)
ALTER TABLE wounds ADD COLUMN content_version TEXT; -- versi konten saat luka disimpan
ALTER TABLE wounds ADD COLUMN depth_layer TEXT;     -- diisi pertanyaan kedalaman (M4)
ALTER TABLE wounds ADD COLUMN burn TEXT;            -- hasil penilaian luka bakar (M4)

ALTER TABLE wound_examinations ADD COLUMN schema INTEGER NOT NULL DEFAULT 1;
ALTER TABLE wound_examinations ADD COLUMN bed_colors TEXT;  -- ["merah", "kuning", …]
ALTER TABLE wound_examinations ADD COLUMN new_odor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE wound_examinations ADD COLUMN skin TEXT;        -- ["lebih_hangat", …]
ALTER TABLE wound_examinations ADD COLUMN spread TEXT;
ALTER TABLE wound_examinations ADD COLUMN burn_worse INTEGER NOT NULL DEFAULT 0;
ALTER TABLE wound_examinations ADD COLUMN assessment TEXT;  -- { level, reasons: [id] } (dihitung di klien)
