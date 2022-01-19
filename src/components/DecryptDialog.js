import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { decrypt } from "../utils/Dencryptor";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import FormHelperText from "@mui/material/FormHelperText";

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
