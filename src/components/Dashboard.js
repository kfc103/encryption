import { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import DecryptDialog from "./DecryptDialog";
import PassphraseDialog from "./PassphraseDialog";
import { encrypt, decrypt } from "/src/utils/Dencryptor";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
//import api from "/src/utils/api";
import SecretTable from "./SecretTable";

const columns = [
  {
    field: "login",
    headerName: "Login",
    width: "50vw"
  } /*,
  {
    field: "password",
    headerName: "Password",
    width: "200"
  }*/
];

export default function Dashboard(props) {
  const [snackbarProp, setSnackbarProp] = useState({
    open: false,
    message: ""
  });

  const onRowClick = (params) => {
    const ciphertext = params.row.password;
    const decrypted = decrypt(ciphertext, props.passphrase);
    if (decrypted) {
      console.log("Password has been decrypted to clipboard");
      setSnackbarProp({
        open: true,
        message: "Password has been decrypted to clipboard"
      });
      navigator.clipboard.writeText(decrypted);
    }
  };

  const handleClose = () => {
    setSnackbarProp({
      open: false,
      message: ""
    });
  };

  return (
    <div>
      <div style={{ height: "95vh", width: "100%" }}>
        <DataGrid
          rows={props.rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          onRowClick={onRowClick}
        />
      </div>

      <Snackbar
        open={snackbarProp.open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          {snackbarProp.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
