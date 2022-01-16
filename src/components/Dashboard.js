import React from "react";
import { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

import { usePassphrase } from "./Passphrase";
import SecretTable from "./SecretTable";
import api from "../utils/api";

export default function Dashboard(props) {
  const { rows, setRows } = props;
  //const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  //const [passphrase, setPassphrase] = useState("");
  //const { getPassphrase, Passphrase, PassphraseNew } = usePassphrase();

  /*const init = async (user) => {
    setBusy(true);
    setPassphrase("");
    const rows = await api.read(user.id);
    //console.log(rows);
    setRows(rows);

    const passphrase = await getPassphrase({
      isCancelable: false,
      ciphertextList: rows.map((item) => {
        return item.data.password;
      })
    });

    setPassphrase(passphrase);
    setBusy(false);
  };

  useEffect(() => {
    //init(props.authenticatedUser);
  }, [props.authenticatedUser]);*/

  const saveItem = async (item) => {
    setBusy(true);
    //console.log("saveItem");
    const newRows = [...rows];
    const index = rows.findIndex((row) => {
      return row.ref === item.ref;
    });

    if (index !== -1) {
      // update item
      const updated = await api.update(item.ref["@ref"].id, item.data);
      newRows[index] = updated;
    } else {
      // create item
      const inserted = await api.insert(item.data);
      newRows.push(inserted);
    }
    setRows(newRows);
    setBusy(false);
  };

  const deleteItem = async (item) => {
    setBusy(true);
    const newRows = [...rows];
    const index = rows.findIndex((row) => {
      return row.ref === item.ref;
    });
    if (index !== -1) {
      // delete item
      await api.remove(item.ref["@ref"].id);
      newRows.splice(index, 1);
    }
    setRows(newRows);
    setBusy(false);
  };

  //console.log(rows.length);
  /*return (
    <React.Fragment>
      {busy && <LinearProgress />}
      {passphrase ? (
        <SecretTable
          rows={rows}
          passphrase={passphrase}
          saveItem={saveItem}
          deleteItem={deleteItem}
          authenticatedUser={props.authenticatedUser}
          diasbled={busy}
        />
      ) : rows.length > 0 ? (
        <Passphrase />
      ) : (
        <PassphraseNew />
      )}
    </React.Fragment>
  );*/
  return (
    <React.Fragment>
      {busy && <LinearProgress />}
      <SecretTable
        rows={props.rows}
        passphrase={props.passphrase}
        saveItem={saveItem}
        deleteItem={deleteItem}
        authenticatedUser={props.authenticatedUser}
        diasbled={busy}
      />
    </React.Fragment>
  );
}
