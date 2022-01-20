import React from "react";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

import SecretTable from "./SecretTable";
import api from "../utils/api";

export default function Dashboard(props) {
  const { rows, setRows } = props;
  const [busy, setBusy] = useState(false);

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
