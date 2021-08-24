import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const useConfirmDialog = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({ title, message, actionCallback }) => {
    setDialogOpen(true);
    setDialogConfig({ title, message, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const ConfirmDialog = () => {
    const onConfirm = () => {
      resetDialog();
      dialogConfig.actionCallback(true);
    };

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(false);
    };

    return (
      <Dialog open={dialogOpen}>
        <DialogTitle>{dialogConfig.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogConfig.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getConfirmation = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { getConfirmation, ConfirmDialog };
};

export { useConfirmDialog };
