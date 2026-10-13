/**
 * Profile kontak yang tampil di footer langkah 4 panduan (Perawatan).
 *
 * WAJIB DIISI SEBELUM RILIS. Kolom bernilai null tidak ditampilkan, jadi aman
 * dikosongkan sampai datanya ada. Jangan isi nomor atau alamat yang belum aktif.
 *
 * - whatsapp  : format internasional tanpa "+" dan spasi, mis. "6281234567890".
 * - instagram : nama akun tanpa "@".
 * - reviewer  : tenaga kesehatan yang meninjau konten (PRD tahap 2, F10), mis.
 *               { name: "dr. Nama Lengkap", role: "Dokter umum", org: "Klinik …" }.
 */
export const CONTACT_PROFILE = {
  name: "Tim LukaCare",
  role: "Layanan pengguna",
  about: "Tanya seputar panduan, aplikasi, atau pesanan perlengkapan.",
  email: "halo@lukacare.com", // TODO: pastikan kotak surat ini aktif sebelum rilis
  whatsapp: null,
  instagram: null,
  website: "https://lukacare.com",
  hours: "Senin–Jumat, 08.00–17.00 WIB", // TODO: sesuaikan dengan jam layanan sebenarnya
  reviewer: null,
};
