import CryptoJS from "crypto-js";

export function encrypt(message, passphrase) {
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(message, passphrase).toString();

  return ciphertext;
}

export function decrypt(ciphertext, passphrase) {
  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(ciphertext, passphrase);
  var originalText = decrypted.toString(CryptoJS.enc.Utf8);

  return originalText;
}
