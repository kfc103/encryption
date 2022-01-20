import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const useMySnackbar = () => {
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

  const MySnackbar = () => {
    const onClose = () => {
      resetDialog();
      dialogConfig.actionCallback(true);
    };

    return (
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={dialogConfig?.duration ? dialogConfig.duration : 5000}
        onClose={onClose}
      >
        <Alert onClose={onClose} severity="info">
          {dialogConfig.message}
        </Alert>
      </Snackbar>
    );
  };

  const showMySnackbar = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { MySnackbar, showMySnackbar };
};

export { useMySnackbar };
