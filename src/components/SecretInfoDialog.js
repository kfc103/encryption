import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { encrypt, decrypt } from "/src/utils/Dencryptor";
import { useConfirmationDialog } from "./ConfirmationDialog";
import { useForm, Controller } from "react-hook-form";

const SecretInfoDialog = ({ open, passphrase, item, action }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid }
  } = useForm();

  const { getConfirmation } = useConfirmationDialog();

  const onCancel = () => {
    if (action?.onCancel) action.onCancel();
  };

  const onSubmit = async (data) => {
    if (isValid) {
      // Check unmatch password
      if (
        (data.newPassword || data.newPasswordCfm) &&
        data.newPassword !== data.newPasswordCfm
      ) {
        setError("newPasswordCfm", {
          type: "manual",
          message: "Unmatch password"
        });
      } else {
        if (data.newPassword) {
          // New password
          if (data.password) {
            // Confirmation dialog for New password
            const confirmed = await getConfirmation({
              title: "Attention!",
              message: "There is no way to restore the old password after save."
            });

            if (!confirmed) return;
          }

          // encrypt new password
          const ciphertext = encrypt(data.newPassword, passphrase);
          if (ciphertext) {
            data.password = ciphertext;
          } else {
            console.log("Fail to encrypt");
            return;
          }
        } else delete data.password;

        delete data.newPassword;
        delete data.newPasswordCfm;

        //console.log(item);
        //console.log(data);

        const newItem = Object.assign({}, item, data);
        console.log(newItem);

        //-------------------------------
        // perform save
        if (newItem) await action.saveItem(newItem);
        //-------------------------------

        if (action?.onConfirm) action.onConfirm(data);
      }
    }
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="form-dialog-title">
          {item?.id ? "Edit Secret" : "Create Secret"}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            defaultValue={item?.name}
            shouldUnregister={true}
            rules={{
              maxLength: { value: 20, message: "Max length is 20" }
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Name"
                helperText={fieldState.error?.message}
                {...field}
                {...fieldState}
              />
            )}
          />
          <Controller
            name="login"
            control={control}
            defaultValue={item?.login}
            shouldUnregister={true}
            rules={{
              required: true,
              maxLength: { value: 20, message: "Max length is 20" }
            }}
            render={({ field, fieldState }) => (
              <TextField
                required
                fullWidth
                label="Login"
                helperText={fieldState.error?.message}
                {...field}
                {...fieldState}
              />
            )}
          />
          {item?.password && (
            <Controller
              name="password"
              control={control}
              defaultValue={decrypt(item.password, passphrase)}
              shouldUnregister={true}
              render={({ field, fieldState }) => (
                <TextField
                  disabled
                  fullWidth
                  label="Password"
                  type="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="copy password"
                          onClick={action.onDecrypt}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...field}
                  {...fieldState}
                />
              )}
            />
          )}
          <Controller
            name="newPassword"
            control={control}
            shouldUnregister={true}
            rules={{
              required: !item?.password
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                required={!item?.password}
                label="New Password"
                type="password"
                helperText={fieldState.error?.message}
                {...field}
                {...fieldState}
              />
            )}
          />
          <Controller
            name="newPasswordCfm"
            control={control}
            shouldUnregister={true}
            rules={{
              required: !item?.password
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                required={!item?.password}
                label="Confirm New Password"
                type="password"
                helperText={fieldState.error?.message}
                {...field}
                {...fieldState}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={!isValid}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const SecretInfoDialogContext = React.createContext({});

const SecretInfoDialogProvider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({
    passphrase,
    item,
    saveItem,
    onDecrypt,
    actionCallback
  }) => {
    setDialogOpen(true);
    setDialogConfig({ passphrase, item, saveItem, onDecrypt, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onCancel = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <SecretInfoDialogContext.Provider value={{ openDialog }}>
      <SecretInfoDialog
        open={dialogOpen}
        passphrase={dialogConfig?.passphrase}
        item={dialogConfig?.item}
        action={{
          onConfirm,
          onCancel,
          saveItem: dialogConfig?.saveItem,
          onDecrypt: dialogConfig?.onDecrypt
        }}
      />
      {children}
    </SecretInfoDialogContext.Provider>
  );
};

const useSecretInfoDialog = () => {
  const { openDialog } = React.useContext(SecretInfoDialogContext);

  const editSecretInfo = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { editSecretInfo };
};

export default SecretInfoDialog;
export { SecretInfoDialogProvider, useSecretInfoDialog };
