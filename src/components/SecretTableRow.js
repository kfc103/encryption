import React from "react";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useConfirmDialog } from "./ConfirmDialog";
import { decrypt } from "../utils/Dencryptor";
import { useSecretInfoDialog } from "./SecretInfoDialog";
import { useMySnackbar } from "./MySnackbar";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  }
});

export default function SecretTableRow(props) {
  const { ConfirmDialog, getConfirmation } = useConfirmDialog();
  const { MySnackbar, showMySnackbar } = useMySnackbar();
  const { row, passphrase, deleteItem, disabled } = props;
  const classes = useRowStyles();
  const { SecretInfoDialog, editSecretInfo } = useSecretInfoDialog();

  const onDecryptBtnClick = (e) => {
    e.stopPropagation();
    const ciphertext = row.data.password;
    const decrypted = decrypt(ciphertext, passphrase);
    if (decrypted) {
      navigator.clipboard.writeText(decrypted);
      showMySnackbar({
        message: "Password has been decrypted to clipboard",
        duration: 1000
      });
    }
  };

  const onDeleteBtnClick = async (e) => {
    e.stopPropagation();
    const confirmed = await getConfirmation({
      title: "Attention!",
      message:
        "Confirm to delete [" + row.data.name + "|" + row.data.login + "] ?"
    });
    if (confirmed) await deleteItem(row);
  };

  const onEditBtnClick = async (e) => {
    e.stopPropagation();
    const edited = await editSecretInfo({
      passphrase: props.passphrase,
      saveItem: props.saveItem,
      authenticatedUser: props.authenticatedUser,
      item: row,
      onDecrypt: onDecryptBtnClick
    });
    console.log(edited);
  };

  return (
    <React.Fragment>
      <ConfirmDialog />
      <MySnackbar />
      <SecretInfoDialog />
      <TableRow hover className={classes.root} key={row.ref}>
        <TableCell>{row.data.name}</TableCell>
        <TableCell>{row.data.login}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={disabled}
            onClick={onDecryptBtnClick}
          >
            <FileCopyIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={disabled}
            onClick={onEditBtnClick}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={disabled}
            onClick={onDeleteBtnClick}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
