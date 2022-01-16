import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
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
