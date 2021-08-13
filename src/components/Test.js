import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { encrypt, decrypt } from "/src/utils/Dencryptor";
import api from "/src/utils/api";

export default function Test() {
  const [message, setMessage] = useState("Hello World");
  const [ciphertext, setCiphertext] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [encryptPassphrase, setEncryptPassphrase] = useState("");
  const [decryptPassphrase, setDecryptPassphrase] = useState("");

  function handleClickEncrypt() {
    // Encrypt
    /*const ciphertext = CryptoJS.AES.encrypt(
      message,
      encryptPassphrase
    ).toString();*/
    const ciphertext = encrypt(message, encryptPassphrase);

    setCiphertext(ciphertext);
    console.log(ciphertext);
  }

  function handleClickDecrypt() {
    // Decrypt
    /*const decrypted = CryptoJS.AES.decrypt(ciphertext, decryptPassphrase);
    var originalText = decrypted.toString(CryptoJS.enc.Utf8);*/
    const originalText = decrypt(ciphertext, decryptPassphrase);

    setOriginalText(originalText);

    console.log(originalText);
  }

  const handleChange = (event) => {
    if (event.target.id === "encrypt-passphrase-input")
      setEncryptPassphrase(event.target.value);
    else if (event.target.id === "decrypt-passphrase-input")
      setDecryptPassphrase(event.target.value);
    else if (event.target.id === "message-input")
      setMessage(event.target.value);
  };

  const testing = () => {
    api.readAll().then(
      (items) => {
        console.log("all items", items);
        //data = items;
        items.map((item) => {
          console.log("data", item.data);
          console.log(decrypt(item.data.password, "123"));

          return null;
        });
      },
      (error) => {
        console.log("componentDidMount readAll fail", error);
      }
    );
  };

  return (
    <div>
      <div>
        <TextField
          required
          id="message-input"
          label="Message"
          value={message}
          onChange={handleChange}
        />
        <TextField
          required
          id="encrypt-passphrase-input"
          label="Encrypt Passphrase"
          type="password"
          value={encryptPassphrase}
          onChange={handleChange}
        />
        <Button variant="outlined" color="primary" onClick={handleClickEncrypt}>
          Encrypt
        </Button>
      </div>
      <Divider />
      <div>
        <TextField
          disabled
          id="ciphertext"
          label="Ciphertext"
          value={ciphertext}
        />
        <TextField
          required
          id="decrypt-passphrase-input"
          label="Decrypt Passphrase"
          type="password"
          value={decryptPassphrase}
          onChange={handleChange}
        />
        <Button variant="outlined" color="primary" onClick={handleClickDecrypt}>
          Decrypt
        </Button>
      </div>

      <h2> {ciphertext} </h2>
      <h2> {originalText} </h2>

      <Button variant="outlined" color="primary" onClick={testing}>
        Test
      </Button>
    </div>
  );
}
