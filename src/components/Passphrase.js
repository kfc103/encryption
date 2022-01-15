import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { decrypt } from "../utils/Dencryptor";
import PassphraseInput from "./PassphraseInput";

const usePassphrase = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({ isCancelable, ciphertextList, actionCallback }) => {
    setDialogOpen(true);
    setDialogConfig({ isCancelable, ciphertextList, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const Passphrase = () => {
    const [passphrase, setPassphrase] = React.useState("");
    const [passphraseError, setPassphraseError] = React.useState("");

    const onConfirm = () => {
      resetDialog();
      dialogConfig.actionCallback(passphrase);
    };

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(null);
    };

    const handleChange = (event) => {
      if (event.target?.id === "passphrase") setPassphrase(event.target.value);
    };

    const handleEnter = () => {
      let isError = false;

      // Start of validation
      if (dialogConfig.ciphertextList) {
        for (let ciphertext of dialogConfig.ciphertextList) {
          const decrypted = decrypt(ciphertext, passphrase);
          if (!decrypted) {
            isError = true;
            break;
          }
        }
      }
      // End of validation

      if (isError) {
        setPassphraseError("Incorrect passphrase");
      } else {
        onConfirm();
      }
    };

    return (
      <Dialog fullScreen open={dialogOpen} aria-labelledby="form-dialog">
        <DialogTitle id="form-dialog-title">
          Enter Master Passphrase
        </DialogTitle>
        <DialogContent>
          <PassphraseInput
            autoFocus
            id="passphrase"
            label="Passphrase"
            value={passphrase}
            onChange={handleChange}
            errortext={passphraseError}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!dialogConfig.isCancelable}
            onClick={onCancel}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleEnter} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const PassphraseNew = () => {
    const [passphrase, setPassphrase] = React.useState("");
    const [passphraseError, setPassphraseError] = React.useState("");
    const [cfmPassphrase, setCfmPassphrase] = React.useState("");
    const [cfmPassphraseError, setCfmPassphraseError] = React.useState("");

    const onConfirm = () => {
      resetDialog();
      dialogConfig.actionCallback(passphrase);
    };

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(null);
    };

    const handleChange = (event) => {
      if (event.target?.id === "passphrase") setPassphrase(event.target.value);
      else if (event.target?.id === "cfm-passphrase")
        setCfmPassphrase(event.target.value);
    };

    const handleEnter = () => {
      let isError = false;
      let passphraseError = "";
      let cfmPassphraseError = "";

      // Start of validation
      if (passphrase === "") {
        isError = true;
        passphraseError = "Passphrase cannot be empty";
      }
      if (passphrase !== cfmPassphrase) {
        isError = true;
        cfmPassphraseError = "Passphrase does not match";
      }
      // End of validation

      if (isError) {
        setPassphraseError(passphraseError);
        setCfmPassphraseError(cfmPassphraseError);
      } else {
        onConfirm();
      }
    };

    return (
      <Dialog fullScreen open={dialogOpen} aria-labelledby="form-dialog">
        <DialogTitle id="form-dialog-title">
          Create New Master Passphrase
        </DialogTitle>
        <DialogContent>
          <PassphraseInput
            autoFocus
            id="passphrase"
            label="New Passphrase"
            value={passphrase}
            onChange={handleChange}
            errortext={passphraseError}
            fullWidth
          />
          <PassphraseInput
            id="cfm-passphrase"
            label="Confirm New Passphrase"
            value={cfmPassphrase}
            onChange={handleChange}
            errortext={cfmPassphraseError}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!dialogConfig.isCancelable}
            onClick={onCancel}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleEnter} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getPassphrase = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { getPassphrase, Passphrase, PassphraseNew };
};

export { usePassphrase };
