import React from "react";
// /import { useState, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SecretTableRow from "./SecretTableRow";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import { useSecretInfoDialog } from "./SecretInfoDialog";
import { makeStyles } from "@material-ui/core/styles";

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
            {props.rows.map((row) => (
              <SecretTableRow key={row.ref.id} row={row} {...props} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Container className={classes.flexbox}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={addBtnHandler}
        >
          <AddIcon />
        </Fab>
      </Container>
    </React.Fragment>
  );
}
