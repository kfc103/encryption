import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { decrypt } from "../utils/Dencryptor";
import PassphraseInput from "./PassphraseInput";

const usePassphrase = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const MODE = { VERIFY: "VERIFY", CREATE: "CREATE", UPDATE: "UPDATE" };

  const openDialog = ({
    mode,
    isCancelable,
    ciphertextList,
    actionCallback
  }) => {
    if (!(mode === MODE.VERIFY || mode === MODE.CREATE || mode === MODE.UPDATE))
      return;

    setDialogOpen(true);
    setDialogConfig({
      mode,
      isCancelable,
      ciphertextList,
      actionCallback
    });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const Passphrase = () => {
    const [passphrase, setPassphrase] = React.useState("");
    const [passphraseError, setPassphraseError] = React.useState("");
    const [newPassphrase, setNewPassphrase] = React.useState("");
    const [newPassphraseError, setNewPassphraseError] = React.useState("");
    const [cfmPassphrase, setCfmPassphrase] = React.useState("");
    const [cfmPassphraseError, setCfmPassphraseError] = React.useState("");

    const onConfirm = () => {
      resetDialog();

      let confirmPassphrase = null;
      switch (dialogConfig.mode) {
        case MODE.VERIFY:
          confirmPassphrase = passphrase;
          break;
        case MODE.CREATE:
        case MODE.UPDATE:
          confirmPassphrase = newPassphrase;
          break;
        default:
          break;
      }
      dialogConfig.actionCallback(confirmPassphrase);
    };

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(null);
    };

    const handleChange = (event) => {
      switch (event.target?.id) {
        case "passphrase":
          setPassphrase(event.target.value);
          break;
        case "new-passphrase":
          setNewPassphrase(event.target.value);
          break;
        case "cfm-passphrase":
          setCfmPassphrase(event.target.value);
          break;
        default:
          break;
      }
    };

    const handleEnter = () => {
      let isError = false;
      let passphraseError = "";
      let newPassphraseError = "";
      let cfmPassphraseError = "";

      // Start of validation
      if (
        dialogConfig.mode === MODE.VERIFY ||
        dialogConfig.mode === MODE.UPDATE
      ) {
        if (dialogConfig.ciphertextList) {
          for (let ciphertext of dialogConfig.ciphertextList) {
            const decrypted = decrypt(ciphertext, passphrase);
            if (!decrypted) {
              passphraseError = "Incorrect Passphrase";
              isError = true;
              break;
            }
          }
        }
      }
      if (
        dialogConfig.mode === MODE.CREATE ||
        dialogConfig.mode === MODE.UPDATE
      ) {
        if (newPassphrase === "") {
          isError = true;
          newPassphraseError = "Passphrase cannot be empty";
        }
        if (newPassphrase !== cfmPassphrase) {
          isError = true;
          cfmPassphraseError = "Passphrase does not match";
        }
      }
      // End of validation

      if (isError) {
        setPassphraseError(passphraseError);
        setNewPassphraseError(newPassphraseError);
        setCfmPassphraseError(cfmPassphraseError);
      } else {
        onConfirm();
      }
    };

    return (
      <Dialog fullScreen open={dialogOpen} aria-labelledby="form-dialog">
        <DialogTitle id="form-dialog-title">
          {dialogConfig.mode === MODE.VERIFY && "Enter Master Passphrase"}
          {dialogConfig.mode === MODE.CREATE && "Create New Master Passphrase"}
          {dialogConfig.mode === MODE.UPDATE && "Change Master Passphrase"}
        </DialogTitle>
        <DialogContent>
          {(dialogConfig.mode === MODE.VERIFY ||
            dialogConfig.mode === MODE.UPDATE) && (
            <PassphraseInput
              autoFocus
              id="passphrase"
              label="Passphrase"
              value={passphrase}
              onChange={handleChange}
              errortext={passphraseError}
              fullWidth
            />
          )}
          {(dialogConfig.mode === MODE.CREATE ||
            dialogConfig.mode === MODE.UPDATE) && (
            <>
              <PassphraseInput
                id="new-passphrase"
                label="New Passphrase"
                value={newPassphrase}
                onChange={handleChange}
                errortext={newPassphraseError}
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
            </>
          )}
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

  return { getPassphrase, Passphrase, MODE };
};

export { usePassphrase };
