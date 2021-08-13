import { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./styles.css";
import Test from "./components/Test";
import PassphraseDialog from "./components/PassphraseDialog";
import PassphraseNewDialog from "./components/PassphraseNewDialog";
//import SecretInfoDialog from "./components/SecretInfoDialog";
import SecretTable from "./components/SecretTable";
import api from "./utils/api";
import { ConfirmationDialogProvider } from "./components/ConfirmationDialog";
import { SecretInfoDialogProvider } from "./components/SecretInfoDialog";
import { MySnackbarProvider } from "./components/MySnackbar";
import netlifyIdentity from "netlify-identity-widget";

export default function App() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [passphraseDialogOpen, setPassphraseDialogOpen] = useState(false);
  const [passphraseNewDialogOpen, setPassphraseNewDialogOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  useEffect(() => {
    async function init() {
      setBusy(true);
      setPassphrase("");
      setPassphraseNewDialogOpen(false);
      setPassphraseDialogOpen(false);
      const rows = await api.readAll();
      if (rows.length === 0) setPassphraseNewDialogOpen(true);
      else setPassphraseDialogOpen(true);
      setRows(rows);
      setBusy(false);
    }
    init();
  }, []);

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

  const netlifyAuth = {
    isAuthenticated: false,
    user: null,
    authenticate(callback) {
      this.isAuthenticated = true;
      netlifyIdentity.open();
      netlifyIdentity.on("login", (user) => {
        console.log(user);
        this.user = user;
        callback(user);
      });
    },
    signout(callback) {
      this.isAuthenticated = false;
      netlifyIdentity.logout();
      netlifyIdentity.on("logout", () => {
        this.user = null;
        callback();
      });
    }
  };

  const Dashboard = () => {
    const login = () => {
      console.log("login");
      netlifyAuth.authenticate(() => {
        console.log("authenticate");
      });
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
              <button onClick={login}>Log in</button>
            </SecretInfoDialogProvider>
          </MySnackbarProvider>
        </ConfirmationDialogProvider>
      );
  };

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}
