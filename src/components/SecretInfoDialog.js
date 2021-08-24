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

          //console.log(item);
          //console.log(data);

          const newItem = Object.assign({}, dialogConfig.item, data);

          //-------------------------------
          // perform save
          if (newItem) await dialogConfig.saveItem(newItem);
          //-------------------------------

          resetDialog();
          dialogConfig.actionCallback(true);
        }
      }
    };

    const onDecryptBtnClick = (e) => {
      e.stopPropagation();
      const ciphertext = dialogConfig.item.password;
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
            {dialogConfig.item?.id ? "Edit Secret" : "Create Secret"}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue={dialogConfig.item?.name}
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
              defaultValue={dialogConfig.item?.login}
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
            {dialogConfig.item?.password && (
              <Controller
                name="password"
                control={control}
                defaultValue={decrypt(
                  dialogConfig.item.password,
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
                required: !dialogConfig.item?.password
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required={!dialogConfig.item?.password}
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
                required: !dialogConfig.item?.password
              }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required={!dialogConfig.item?.password}
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
