import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";

const getDefaultPassphraseProps = () => {
  return {
    value: "",
    showPassword: false,
    isError: false,
    errorMessage: ""
  };
};

export default function PassphraseNewDialog(props) {
  const { open, setOpen, isCancelable, setPassphrase } = {
    ...props
  };
  const [inputPassphrase, setInputPassphrase] = React.useState(
    getDefaultPassphraseProps()
  );
  const [confirmPassphrase, setConfirmPassphrase] = React.useState(
    getDefaultPassphraseProps()
  );
  const [snackbarProp, setSnackbarProp] = React.useState({
    open: false,
    message: ""
  });

  const handleClose = () => {
    setInputPassphrase(getDefaultPassphraseProps());
    setConfirmPassphrase(getDefaultPassphraseProps());
    setOpen(false);
    setSnackbarProp({
      open: false,
      message: ""
    });
  };

  const handleEnter = () => {
    let isError = false;
    let inputPassphraseProps = getDefaultPassphraseProps();
    let confirmPassphraseProps = getDefaultPassphraseProps();

    // Start of validation
    if (inputPassphrase.value === "") {
      isError = true;
      inputPassphraseProps.isError = true;
      inputPassphraseProps.errorMessage = "Passphrase cannot be empty";
    }
    if (inputPassphrase.value !== confirmPassphrase.value) {
      isError = true;
      confirmPassphraseProps.isError = true;
      confirmPassphraseProps.errorMessage = "Passphrase does not match";
    }
    // End of validation

    if (isError) {
      setInputPassphrase({
        ...inputPassphrase,
        isError: inputPassphraseProps.isError,
        errorMessage: inputPassphraseProps.errorMessage
      });
      setConfirmPassphrase({
        ...confirmPassphrase,
        isError: confirmPassphraseProps.isError,
        errorMessage: confirmPassphraseProps.errorMessage
      });
    } else {
      setPassphrase(inputPassphrase.value);
      handleClose();
    }
  };

  const handleChange = (prop) => (event) => {
    if (event.target.id === "enter-passphrase")
      setInputPassphrase({ ...inputPassphrase, [prop]: event.target.value });
    else if (event.target.id === "confirm-passphrase")
      setConfirmPassphrase({
        ...confirmPassphrase,
        [prop]: event.target.value
      });
  };

  /*const handleClickShowPassword = () => {
    setInputPassphrase({
      ...inputPassphrase,
      showPassword: !inputPassphrase.showPassword
    });
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmPassphrase({
      ...confirmPassphrase,
      showPassword: !confirmPassphrase.showPassword
    });
  };*/

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
          Create new master passphrase
        </DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            id="enter-passphrase"
            label="Password"
            type="password"
            value={inputPassphrase.password}
            onChange={handleChange("value")}
            fullWidth
            error={inputPassphrase.isError}
            aria-describedby="component-error-text"
          />
          <FormHelperText
            id="component-error-text"
            error={inputPassphrase.isError}
          >
            {inputPassphrase.isError
              ? inputPassphrase.errorMessage
              : "Enter Passphrase"}
          </FormHelperText>
          <Input
            id="confirm-passphrase"
            label="Password"
            type="password"
            value={confirmPassphrase.password}
            onChange={handleChange("value")}
            fullWidth
            error={confirmPassphrase.isError}
            aria-describedby="component-error-text"
          />
          <FormHelperText
            id="component-error-text"
            error={confirmPassphrase.isError}
          >
            {confirmPassphrase.isError
              ? confirmPassphrase.errorMessage
              : "Confirm Passphrase"}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isCancelable ? false : true}
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
