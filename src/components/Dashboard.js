import { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import PassphraseDialog from "./PassphraseDialog";
import PassphraseNewDialog from "./PassphraseNewDialog";
import SecretTable from "./SecretTable";
import api from "../utils/api";
import { ConfirmationDialogProvider } from "./ConfirmationDialog";
import { SecretInfoDialogProvider } from "./SecretInfoDialog";
import { MySnackbarProvider } from "./MySnackbar";

export default function Dashboard(props) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [passphraseDialogOpen, setPassphraseDialogOpen] = useState(false);
  const [passphraseNewDialogOpen, setPassphraseNewDialogOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  const init = async () => {
    setBusy(true);
    setPassphrase("");
    setPassphraseNewDialogOpen(false);
    setPassphraseDialogOpen(false);
    const rows = await api.readAll();
    if (rows.length === 0) setPassphraseNewDialogOpen(true);
    else setPassphraseDialogOpen(true);
    setRows(rows);
    setBusy(false);
  };

  useEffect(() => {
    init();
  }, [props.authenticatedUser]);

  const saveItem = (item) => {
    console.log("saveItem");
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const newRows = [...rows];
        const index = rows.findIndex((row) => {
          return row.id === item.id;
        });
        if (index !== -1) {
          // update item
          newRows[index] = item;
        } else {
          // create item
          item.id = newRows.length + 1;
          newRows.push(item);
        }
        setRows(newRows);

        console.log("saveItem resolved");
        resolve();
      }, 100);
    });
    return myPromise;
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

  if (busy) return <LinearProgress />;
  else
    return (
      <ConfirmationDialogProvider>
        <MySnackbarProvider>
          <SecretInfoDialogProvider>
            {passphrase && (
              <SecretTable
                rows={rows}
                passphrase={passphrase}
                saveItem={saveItem}
                deleteItem={deleteItem}
              />
            )}
            <PassphraseDialog
              open={passphraseDialogOpen}
              setOpen={setPassphraseDialogOpen}
              isCancelable={false}
              ciphertextList={rows.map((item) => {
                return item.password;
              })}
              setPassphrase={setPassphrase}
            />
            <PassphraseNewDialog
              open={passphraseNewDialogOpen}
              setOpen={setPassphraseNewDialogOpen}
              isCancelable={false}
              setPassphrase={setPassphrase}
            />
          </SecretInfoDialogProvider>
        </MySnackbarProvider>
      </ConfirmationDialogProvider>
    );
}
