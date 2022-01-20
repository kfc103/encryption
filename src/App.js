import React, { useEffect } from "react";
import { Suspense, lazy } from "react";
import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import MyAppBar from "./components/MyAppBar";
import Setting from "./components/Setting";
import netlifyIdentity from "netlify-identity-widget";
import { usePassphrase } from "./components/Passphrase";
import api from "./utils/api";

const netlifyAuth = {
  //isAuthenticated: false,
  //user: null,
  authenticate(callback) {
    //this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      //this.user = user;
      callback(user);
    });
  },
  signout(callback) {
    //this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on("logout", () => {
      //this.user = null;
      callback();
    });
  }
};

export default function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(
    JSON.parse(localStorage.getItem("gotrue.user"))
    /*JSON.parse(
      '{"url":"/.netlify/identity","token":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjkyODEzNTAsInN1YiI6IjQ0NzUzZGM2LTRlOWEtNDU4MS04ZDI1LWZmZWUwNGQ2MTUzOSIsImVtYWlsIjoia2ZjaGFuMTAzQGdtYWlsLmNvbSIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoia2ZjaGFuMTAzIn19.DeWih_RVscoiIRxBRN8l25eQkmihEywFWGKzi_SdFII","token_type":"bearer","expires_in":3600,"refresh_token":"SNtXq7IVIQrXCVvrhfzXtg","expires_at":1629788623000},"id":"44753dc6-4e9a-4581-8d25-ffee04d61539","aud":"","role":"","email":"kfchan103@gmail.com","confirmed_at":"2021-08-13T07:31:48Z","confirmation_sent_at":"2021-08-13T07:31:15Z","app_metadata":{"provider":"email"},"user_metadata":{"full_name":"kfchan103"},"created_at":"2021-08-13T07:31:15Z","updated_at":"2021-08-13T07:31:15Z"}'
    )*/
  );
  const [isAuthenWidgetOpen, setIsAuthenWidgetOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [passphrase, setPassphrase] = useState("");
  const { getPassphrase, Passphrase, MODE } = usePassphrase();

  const login = () => {
    console.log("login");
    netlifyAuth.authenticate((user) => {
      console.log("login successfully");
      setAuthenticatedUser(user);
    });
  };

  const logout = useCallback(() => {
    console.log("logout");
    netlifyAuth.signout(() => {
      console.log("logout successfully");
      setAuthenticatedUser(null);
    });
  }, []);

  const init = async (user) => {
    //setBusy(true);
    setPassphrase("");
    let rows = [];
    if (user) rows = await api.read(user.id);
    //console.log(rows);
    setRows(rows);

    const passphrase = await getPassphrase({
      mode: rows.length > 0 ? MODE.VERIFY : MODE.CREATE,
      isCancelable: false,
      ciphertextList: rows.map((item) => {
        return item.data.password;
      })
    });

    setPassphrase(passphrase);
    //setBusy(false);
  };

  useEffect(() => {
    netlifyIdentity.on("open", () => setIsAuthenWidgetOpen(true));
    netlifyIdentity.on("close", () => setIsAuthenWidgetOpen(false));
    netlifyIdentity.on("error", (err) => console.error("Error", err));
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (authenticatedUser) {
        const token = authenticatedUser.token;
        const now = Date.now();
        if (now >= token.expires_at) {
          console.log("Expired");
          logout();
        }
      }
    }, 3000);

    init(authenticatedUser);
  }, [logout, authenticatedUser]);

  return (
    <div className="App">
      <CssBaseline />
      <MyAppBar
        isAuthenWidgetOpen={isAuthenWidgetOpen}
        authenticatedUser={authenticatedUser}
        onLogin={login}
        onLogout={logout}
        {...this?.props}
      />
      {authenticatedUser &&
        !isAuthenWidgetOpen &&
        (passphrase ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    rows={rows}
                    setRows={setRows}
                    passphrase={passphrase}
                    authenticatedUser={authenticatedUser}
                  />
                }
              />
              <Route
                path="/setting"
                element={
                  <Setting
                    rows={rows}
                    setRows={setRows}
                    passphrase={passphrase}
                    setPassphrase={setPassphrase}
                  />
                }
              />
              <Route path="/about" element={<div>about</div>} />
            </Routes>
          </Suspense>
        ) : (
          <Passphrase />
        ))}
    </div>
  );
}
