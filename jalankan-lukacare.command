#!/bin/bash
# Klik dua kali file ini di Finder untuk menjalankan LukaCare di komputer ini:
# - API (apps/api, Cloudflare Worker lokal + D1 + R2 simulasi) di http://localhost:8787
# - Web (apps/web) di http://localhost:3001, terhubung ke API di atas
ROOT="$(cd "$(dirname "$0")" && pwd)"

pause_and_exit() {
  read -r -p "Tekan Enter untuk menutup jendela ini."
  exit 1
}

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js belum terpasang di komputer ini."
  echo "Pasang versi LTS dari https://nodejs.org, lalu jalankan file ini lagi."
  open "https://nodejs.org/" 2>/dev/null
  pause_and_exit
fi

major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$major" -lt 20 ]; then
  echo "Node.js Anda versi $(node -v). LukaCare butuh versi 20 atau lebih baru."
  echo "Pasang versi LTS terbaru dari https://nodejs.org, lalu coba lagi."
  pause_and_exit
fi

# ---------- API ----------
cd "$ROOT/apps/api" || pause_and_exit
if [ ! -d node_modules ]; then
  echo "Memasang dependency API (hanya sekali, sekitar 1-2 menit)..."
  npm ci || { echo "npm ci untuk API gagal."; pause_and_exit; }
fi
if [ ! -f .dev.vars ]; then
  secret=$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')
  sed "s/^FILE_SIGNING_SECRET=.*/FILE_SIGNING_SECRET=$secret/" .dev.vars.example > .dev.vars
fi
# .dev.vars lama (sebelum ada verifikasi email) belum punya baris ini.
grep -q '^DEV_EXPOSE_CODES=' .dev.vars || printf '\nDEV_EXPOSE_CODES=true\n' >> .dev.vars
npm run db:migrate:local >/dev/null 2>&1 || { echo "Migrasi database lokal gagal."; pause_and_exit; }
npm run db:seed:local 2>/dev/null | grep "Akun demo" || { echo "Gagal membuat akun demo."; pause_and_exit; }

echo "Menyalakan API di http://localhost:8787 ..."
npm run dev -- --port 8787 > "$ROOT/apps/api/.wrangler-dev.log" 2>&1 &
API_PID=$!
trap 'kill $API_PID 2>/dev/null' EXIT INT TERM

for _ in $(seq 1 60); do
  curl -s http://localhost:8787/health >/dev/null 2>&1 && break
  if ! kill -0 $API_PID 2>/dev/null; then
    echo "API gagal menyala. Lihat apps/api/.wrangler-dev.log untuk detailnya."
    pause_and_exit
  fi
  sleep 1
done

# ---------- Web ----------
cd "$ROOT/apps/web" || pause_and_exit
if [ ! -d node_modules ]; then
  echo "Memasang dependency web (hanya sekali, sekitar 1 menit)..."
  npm install || { echo "npm install untuk web gagal."; pause_and_exit; }
fi

echo ""
echo "LukaCare berjalan. Browser akan terbuka otomatis."
echo "Masuk dengan akun demo: demo@lukacare.test / lukacare123"
echo "Kode verifikasi untuk akun baru tampil di layar (dan di apps/api/.wrangler-dev.log)."
echo "Biarkan jendela ini terbuka. Tekan Ctrl+C untuk berhenti (API ikut berhenti)."
echo ""
npm run dev -- --open
