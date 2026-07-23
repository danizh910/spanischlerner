const DEVICE_KEY_STORAGE_KEY = "spanischlerner:device-key:v1";

// Small, recognizable Spanish nouns - just for a memorable code prefix.
const WORDS = [
  "perro", "gato", "casa", "agua", "sol", "luna", "mar", "pan", "vino",
  "libro", "mesa", "silla", "playa", "monte", "rio", "flor", "fuego",
  "nube", "tren", "avion", "coche", "reloj", "puerta", "calle", "campo",
  "pueblo", "cielo", "arbol", "piedra", "nieve", "lluvia", "viento",
  "estrella", "camino", "jardin", "ventana", "espejo", "musica", "baile",
] as const;

// Excludes O/0 and I/1 so codes stay unambiguous when read aloud or typed.
const SAFE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SUFFIX_LENGTH = 4;

function randomSuffix(): string {
  let out = "";
  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    out += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return out;
}

/** Generates a code like "PERRO-7F2K". Not cryptographically secure - this
 * is a shareable access code, not a password. */
export function generateDeviceCode(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return `${word.toUpperCase()}-${randomSuffix()}`;
}

/** Returns the current device's code, generating and persisting one on
 * first call. */
export function getDeviceKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(DEVICE_KEY_STORAGE_KEY);
  if (!key) {
    key = generateDeviceCode();
    window.localStorage.setItem(DEVICE_KEY_STORAGE_KEY, key);
  }
  return key;
}

export function setDeviceKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEVICE_KEY_STORAGE_KEY, key);
}
