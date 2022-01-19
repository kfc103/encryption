import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { encrypt, decrypt } from "../utils/Dencryptor";
import { useConfirmDialog } from "./ConfirmDialog";
import { useMySnackbar } from "./MySnackbar";
import { useForm, Controller } from "react-hook-form";

const useSecretInfoDialog = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({
    passphrase,
    item,
    authenticatedUser,
    saveItem,
    onDecrypt,
    actionCallback
  }) => {
    setDialogOpen(true);
    setDialogConfig({
      passphrase,
      item,
      authenticatedUser,
      saveItem,
      onDecrypt,
      actionCallback
    });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const SecretInfoDialog = () => {
    const {
      control,
      handleSubmit,
      setError,
      formState: { isValid }
    } = useForm();

    const { ConfirmDialog, getConfirmation } = useConfirmDialog();
    const { MySnackbar, showMySnackbar } = useMySnackbar();

    const onCancel = () => {
      resetDialog();
      dialogConfig.actionCallback(false);
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
                message:
                  "There is no way to restore the old password after save."
              });

              if (!confirmed) return;
            }

            // encrypt new password
            const ciphertext = encrypt(
              data.newPassword,
              dialogConfig.passphrase
            );
            if (ciphertext) {
              data.password = ciphertext;
            } else {
              console.log("Fail to encrypt");
              return;
            }
          } else delete data.password;

          delete data.newPassword;
          delete data.newPasswordCfm;

          //console.log(dialogConfig);
          //console.log(data);

          let newItem;
          if (dialogConfig.item)
            newItem = Object.assign({}, dialogConfig.item, {
              data: Object.assign({}, dialogConfig.item.data, data)
            });
          else
            newItem = Object.assign(
              {},
              { data: { user_id: dialogConfig.authenticatedUser.id, ...data } }
            );

          //-------------------------------
          // perform save
          //console.log(newItem);
          if (newItem) dialogConfig.saveItem(newItem);
          //-------------------------------

          resetDialog();
          dialogConfig.actionCallback(true);
        }
      }
    };

    const onDecryptBtnClick = (e) => {
      e.stopPropagation();
      const ciphertext = dialogConfig.item.data.password;
      const decrypted = decrypt(ciphertext, dialogConfig.passphrase);
      if (decrypted) {
        navigator.clipboard.writeText(decrypted);
        showMySnackbar({
          message: "Password has been decrypted to clipboard",
          duration: 1000
        });
      }
    };

    return (
      <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
        <ConfirmDialog />
        <MySnackbar />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">
            {dialogConfig.item?.data.id ? "Edit Secret" : "Create Secret"}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue={dialogConfig.item?.data.name}
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
              defaultValue={dialogConfig.item?.data.login}
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
            {dialogConfig.item?.data.password && (
              <Controller
                name="password"
                control={control}
                defaultValue={decrypt(
                  dialogConfig.item.data.password,
                  dialogConfig.passphrase,
                  true
                )}
                shouldUnregister={true}
                render={({ field, fieldState }) => (
                  <TextField
                    disabled
                    fullWidth
                    label="Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="copy password"
                            onClick={onDecryptBtnClick}
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
                required: !dialogConfig.item?.data.password
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required={!dialogConfig.item?.data.password}
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
                required: !dialogConfig.item?.data.password
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required={!dialogConfig.item?.data.password}
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

  const editSecretInfo = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { editSecretInfo, SecretInfoDialog };
};

export { useSecretInfoDialog };
