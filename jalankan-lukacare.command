#!/bin/bash
# Klik dua kali file ini di Finder untuk menjalankan LukaCare di http://localhost:3001
cd "$(dirname "$0")/apps/web" || exit 1

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js belum terpasang di Mac ini."
  echo "Pasang versi LTS dari https://nodejs.org, lalu klik dua kali file ini lagi."
  open "https://nodejs.org/" 2>/dev/null
  read -r -p "Tekan Enter untuk menutup jendela ini."
  exit 1
fi

major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$major" -lt 20 ]; then
  echo "Node.js Anda versi $(node -v). LukaCare butuh versi 20 atau lebih baru."
  echo "Pasang versi LTS terbaru dari https://nodejs.org, lalu coba lagi."
  read -r -p "Tekan Enter untuk menutup jendela ini."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Memasang dependency (hanya sekali, sekitar 1 menit)..."
  npm install || { read -r -p "npm install gagal. Tekan Enter untuk menutup."; exit 1; }
fi

echo ""
echo "LukaCare berjalan. Browser akan terbuka otomatis."
echo "Biarkan jendela ini terbuka. Tekan Ctrl+C untuk berhenti."
echo ""
npm run dev -- --open
