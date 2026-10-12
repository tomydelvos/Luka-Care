// Akses localStorage yang aman: mode privat atau storage penuh tidak membuat app crash.
const PREFIX = "lukacare:";

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* abaikan */
  }
}

export function clearAll() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* abaikan */
  }
}

export function exportAll() {
  const out = {};
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => {
        out[k.slice(PREFIX.length)] = JSON.parse(window.localStorage.getItem(k));
      });
  } catch {
    /* abaikan */
  }
  return out;
}
