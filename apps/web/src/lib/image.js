// Kompres foto di browser sebelum disimpan/diunggah.
// Foto luka tidak perlu resolusi penuh untuk perbandingan harian, dan ukuran
// kecil menghemat kuota (localStorage sekarang, R2 nanti).
export function compressImage(file, { maxSize = 720, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih bukan gambar."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Foto tidak bisa dibaca. Coba pilih foto lain."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format foto tidak didukung. Gunakan JPG atau PNG."));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
