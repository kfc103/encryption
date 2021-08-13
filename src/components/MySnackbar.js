import React from "react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const MySnackbar = ({ open, message, duration, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration ? duration : 5000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
};

const MySnackbarContext = React.createContext({});

const MySnackbarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({ message, duration, actionCallback }) => {
    setOpen(true);
    setDialogConfig({ message, duration, actionCallback });
  };

  const resetDialog = () => {
    setOpen(false);
    setDialogConfig({});
  };

  const onClose = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  return (
    <MySnackbarContext.Provider value={{ openDialog }}>
      <MySnackbar
        open={open}
        message={dialogConfig?.message}
        duration={dialogConfig?.duration}
        onClose={onClose}
      />
      {children}
    </MySnackbarContext.Provider>
  );
};

const useMySnackbar = () => {
  const { openDialog } = React.useContext(MySnackbarContext);

  const showMySnackbar = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { showMySnackbar };
};

export default MySnackbar;
export { MySnackbarProvider, useMySnackbar };
