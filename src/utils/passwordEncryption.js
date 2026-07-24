import { API_BASE_URL } from "../Url/Url";

const ENCRYPTION_PREFIX = "enc:v1:";

export const getApiHostname = () => {
  try {
    return new URL(API_BASE_URL).hostname;
  } catch {
    return typeof window !== "undefined" ? window.location.hostname : "localhost";
  }
};

export const getPasswordEncryptionSecret = () =>
  process.env.REACT_APP_PASSWORD_ENCRYPTION_SECRET ||
  `connectwork-jobportal-v1-${getApiHostname()}`;

const bytesToBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const deriveAesKey = async (secret) => {
  const keyMaterial = new TextEncoder().encode(secret);
  const hash = await crypto.subtle.digest("SHA-256", keyMaterial);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
  ]);
};

export const isEncryptedPassword = (value) =>
  typeof value === "string" && value.startsWith(ENCRYPTION_PREFIX);

export const encryptPassword = async (plainPassword) => {
  if (plainPassword == null || plainPassword === "") return plainPassword;
  if (isEncryptedPassword(plainPassword)) return plainPassword;

  const secret = getPasswordEncryptionSecret();
  const key = await deriveAesKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(String(plainPassword));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    encoded,
  );

  const cipherBytes = new Uint8Array(encrypted);
  const payload = new Uint8Array(iv.length + cipherBytes.length);
  payload.set(iv, 0);
  payload.set(cipherBytes, iv.length);

  return `${ENCRYPTION_PREFIX}${bytesToBase64(payload)}`;
};

export const encryptPasswordFields = async (payload, fields) => {
  const result = { ...payload };

  for (const field of fields) {
    if (result[field] != null && result[field] !== "") {
      result[field] = await encryptPassword(result[field]);
    }
  }

  return result;
};
