import CryptoJS from "crypto-js";

export function encrypt(message, passphrase) {
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(message, passphrase).toString();
  return ciphertext;
}

export function decrypt(ciphertext, passphrase, isOutputMasked) {
  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(ciphertext, passphrase);
  let originalText;
  try {
    originalText = decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    originalText = "";
  }

  if (isOutputMasked) {
    const length = originalText.length;
    if (length >= 3)
      return (
        originalText.substring(0, 1) +
        "●".repeat(length - 2) +
        originalText.substring(length - 1, length)
      );
    else return "●".repeat(length);
  } else return originalText;
}
