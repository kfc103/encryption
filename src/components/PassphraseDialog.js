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
import { encrypt, decrypt } from "./utils/Dencryptor";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";

export default function PassphraseDialog(props) {
  const { open, setOpen, isCancelable, ciphertextList, setPassphrase } = {
    ...props
  };
  const [inputPassphrase, setInputPassphrase] = React.useState({
    value: "",
    showPassword: false,
    isError: false,
    errorMessage: ""
  });
  const [snackbarProp, setSnackbarProp] = React.useState({
    open: false,
    message: ""
  });

  const handleClose = () => {
    setInputPassphrase({
      value: "",
      showPassword: false,
      isError: false,
      errorMessage: ""
    });
    setOpen(false);
    setSnackbarProp({
      open: false,
      message: ""
    });
  };

  const handleEnter = () => {
    let isError = false;
    if (ciphertextList) {
      for (let ciphertext of ciphertextList) {
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
      setPassphrase(inputPassphrase.value);
      handleClose();
    }
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

  return (
    <div>
      <Snackbar
        open={snackbarProp.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          {snackbarProp.message}
        </Alert>
      </Snackbar>

      <Dialog fullScreen open={open} aria-labelledby="form-dialog-title">
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
            disabled={!isCancelable}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleEnter} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
