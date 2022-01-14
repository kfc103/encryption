import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import PassphraseDialog from "./PassphraseDialog";
import PassphraseNewDialog from "./PassphraseNewDialog";

import { usePassphrase } from "./Passphrase";
import SecretTable from "./SecretTable";
import api from "../utils/api";

export default function Dashboard(props) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [passphraseDialogOpen, setPassphraseDialogOpen] = useState(false);
  const [passphraseNewDialogOpen, setPassphraseNewDialogOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const { getPassphrase, Passphrase } = usePassphrase();

  const init = async (user) => {
    setBusy(true);
    setPassphrase("");
    setPassphraseNewDialogOpen(false);
    setPassphraseDialogOpen(false);
    //const rows = await api.readAll(user);
    const rows = await api.read(user.id);
    console.log(rows);

    if (rows.length === 0) setPassphraseNewDialogOpen(true);
    //else setPassphraseDialogOpen(true);
    else {
      const passphrase = await getPassphrase({
        isCancelable: false,
        ciphertextList: rows.map((item) => {
          return item.data.password;
        })
      });
      setPassphrase(passphrase);
    }
    setRows(rows);
    setBusy(false);
  };

  useEffect(() => {
    init(props.authenticatedUser);
  }, [props.authenticatedUser]);

  /*const saveItem = (item) => {
    console.log("saveItem");
    console.log(item);

    const myPromise = new Promise((resolve, reject) => {
      //await api.insert();
      //setTimeout(() => {
      const newRows = [...rows];
      const index = rows.findIndex((row) => {
        return row.ref === item.ref;
      });

      //console.log(index);
      if (index !== -1) {
        // update item

        const updated = api.update(item.ref["@ref"].id, item.data);
        updated.then((data) => {
          newRows[index] = data;
          setRows(newRows);

          console.log("saveItem resolved");
          resolve();
        });
      } else {
        // create item
        item.id = newRows.length + 1;
        newRows.push(item);
        setRows(newRows);

        console.log("saveItem resolved");
        resolve();
      }

      //}, 100);
    });
    return myPromise;
  };*/
  const saveItem = async (item) => {
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
  };

  const deleteItem = (item) => {
    console.log("deleteItem");
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const newRows = [...rows];
        const index = rows.findIndex((row) => {
          return row.id === item.id;
        });
        if (index !== -1) {
          newRows.splice(index, 1);
        }
        setRows(newRows);

        console.log("deleteItem resolved");
        resolve();
      }, 100);
    });
    return myPromise;
  };

  if (busy)
    return (
      <React.Fragment>
        <LinearProgress />
        <Passphrase />
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        {passphrase && (
          <SecretTable
            rows={rows}
            passphrase={passphrase}
            saveItem={saveItem}
            deleteItem={deleteItem}
            authenticatedUser={props.authenticatedUser}
          />
        )}
      </React.Fragment>
    );
}
