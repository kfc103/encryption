import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useConfirmationDialog } from "./ConfirmationDialog";
import { decrypt } from "/src/utils/Dencryptor";
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
  const { getConfirmation } = useConfirmationDialog();
  const { showMySnackbar } = useMySnackbar();
  const { row, passphrase, deleteItem } = props;
  const classes = useRowStyles();
  const { editSecretInfo } = useSecretInfoDialog();

  const onDecryptBtnClick = (e) => {
    e.stopPropagation();
    const ciphertext = row.password;
    const decrypted = decrypt(ciphertext, passphrase);
    if (decrypted) {
      navigator.clipboard.writeText(decrypted);
      showMySnackbar({
        message: "Password has been decrypted to clipboard",
        duration: 1000
      });
      console.log("Password has been decrypted to clipboard");
    }
  };

  const onDeleteBtnClick = async (e) => {
    e.stopPropagation();
    const confirmed = await getConfirmation({
      title: "Attention!",
      message: "Confirm to delete [" + row.name + "|" + row.login + "] ?"
    });
    if (confirmed) deleteItem(row);
  };

  const onEditBtnClick = async (e) => {
    e.stopPropagation();
    const edited = await editSecretInfo({
      passphrase: props.passphrase,
      saveItem: props.saveItem,
      item: row,
      onDecrypt: onDecryptBtnClick
    });
    console.log(edited);
  };

  return (
    <React.Fragment>
      <TableRow hover className={classes.root}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.login}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={onDecryptBtnClick}
          >
            <FileCopyIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={onEditBtnClick}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={onDeleteBtnClick}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

SecretTableRow.propTypes = {
  row: PropTypes.shape({
    login: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired
};
