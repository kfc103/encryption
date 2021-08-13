import React from "react";
import { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SecretTableRow from "./components/SecretTableRow";
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
  const { editSecretInfo } = useSecretInfoDialog();

  const addBtnHandler = async () => {
    const edited = await editSecretInfo({
      passphrase: props.passphrase,
      saveItem: props.saveItem
    });
    console.log(edited);
  };

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Login</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row) => (
              <SecretTableRow
                key={row.id}
                row={row}
                passphrase={props.passphrase}
                deleteItem={props.deleteItem}
              />
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
