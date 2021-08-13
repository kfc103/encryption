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

export default function DecryptDialog(props) {
  const { open, setOpen, ciphertext } = { ...props };
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
    isPassphaseError: false
  });
  const [snackbarProp, setSnackbarProp] = React.useState({
    open: false,
    message: ""
  });

  const handleClose = () => {
    setValues({
      password: "",
      showPassword: false,
      isPassphaseError: false
    });
    setOpen(false);
    setSnackbarProp({
      open: false,
      message: ""
    });
  };

  const handleDecrypt = () => {
    const decrypted = decrypt(ciphertext, values.password);
    if (decrypted) {
      setOpen(false);
      setValues({ ...values, isPassphaseError: false });
      setSnackbarProp({
        open: true,
        message: "Password has been decrypted to clipboard"
      });
      navigator.clipboard.writeText(decrypted);
    } else {
      setValues({ ...values, isPassphaseError: true });
    }
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Decrypt</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter passphrase:</DialogContentText>
          <Input
            autoFocus
            id="standard-adornment-password"
            label="Password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            fullWidth
            error={values.isPassphaseError}
            aria-describedby="component-error-text"
          />
          {values.isPassphaseError ? (
            <FormHelperText
              id="component-error-text"
              error={values.isPassphaseError}
            >
              Incorrect passphrase
            </FormHelperText>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDecrypt} color="primary">
            Decrypt
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
