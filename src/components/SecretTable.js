import React from "react";
// /import { useState, useCallback } from "react";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SecretTableRow from "./SecretTableRow";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import { useSecretInfoDialog } from "./SecretInfoDialog";

// A style sheet
const useStyles = makeStyles((theme) => {
  return {
    fab: {
      position: "fixed",
      margin: "auto",
      bottom: theme.spacing(2)
    },
    flexbox: {
      display: "flex",
      width: "100%",
      justifyContent: "center"
    }
  };
});

export default function SecretTable(props) {
  const classes = useStyles();
  const { SecretInfoDialog, editSecretInfo } = useSecretInfoDialog();

  const addBtnHandler = async () => {
    await editSecretInfo({
      passphrase: props.passphrase,
      saveItem: props.saveItem,
      authenticatedUser: props.authenticatedUser
    });
  };

  return (
    <React.Fragment>
      <SecretInfoDialog />
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, index) => (
              <SecretTableRow key={index} row={row} {...props} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Container className={classes.flexbox}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          disabled={props.disabled}
          onClick={addBtnHandler}
        >
          <AddIcon />
        </Fab>
      </Container>
    </React.Fragment>
  );
}
