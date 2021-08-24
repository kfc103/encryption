import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { encrypt, decrypt } from "../utils/Dencryptor";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";

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
    const [inputPassphrase, setInputPassphrase] = React.useState({
      value: "",
      showPassword: false,
      isError: false,
      errorMessage: ""
    });

    const onConfirm = () => {
      resetDialog();
      dialogConfig.actionCallback(inputPassphrase.value);
    };

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(null);
    };

    const handleChange = (prop) => (event) => {
      setInputPassphrase({ ...inputPassphrase, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
      setInputPassphrase({
        ...inputPassphrase,
        showPassword: !inputPassphrase.showPassword
      });
    };

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleEnter = () => {
      let isError = false;

      if (dialogConfig.ciphertextList) {
        for (let ciphertext of dialogConfig.ciphertextList) {
          const decrypted = decrypt(ciphertext, inputPassphrase.value);
          if (!decrypted) {
            isError = true;
            break;
          }
        }
      }
      if (isError) {
        setInputPassphrase({
          ...inputPassphrase,
          isError: true,
          errorMessage: "Incorrect passphrase"
        });
      } else {
        onConfirm();
      }
    };

    return (
      <Dialog fullScreen open={dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Enter master passphrase
        </DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            id="enter-passphrase"
            label="Password"
            type={inputPassphrase.showPassword ? "text" : "password"}
            value={inputPassphrase.password}
            onChange={handleChange("value")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {inputPassphrase.showPassword ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            }
            fullWidth
            error={inputPassphrase.isError}
            aria-describedby="component-error-text"
          />
          {inputPassphrase.isError ? (
            <FormHelperText
              id="component-error-text"
              error={inputPassphrase.isError}
            >
              {inputPassphrase.errorMessage}
            </FormHelperText>
          ) : null}
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

  return { getPassphrase, Passphrase };
};

export { usePassphrase };
