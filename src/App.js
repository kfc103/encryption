import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import netlifyIdentity from "netlify-identity-widget";
import MyAppBar from "./components/MyAppBar";

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
    //JSON.parse(localStorage.getItem("gotrue.user"))
    JSON.parse(
      '{"url":"/.netlify/identity","token":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjkyODEzNTAsInN1YiI6IjQ0NzUzZGM2LTRlOWEtNDU4MS04ZDI1LWZmZWUwNGQ2MTUzOSIsImVtYWlsIjoia2ZjaGFuMTAzQGdtYWlsLmNvbSIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoia2ZjaGFuMTAzIn19.DeWih_RVscoiIRxBRN8l25eQkmihEywFWGKzi_SdFII","token_type":"bearer","expires_in":3600,"refresh_token":"SNtXq7IVIQrXCVvrhfzXtg","expires_at":1629788623000},"id":"44753dc6-4e9a-4581-8d25-ffee04d61539","aud":"","role":"","email":"kfchan103@gmail.com","confirmed_at":"2021-08-13T07:31:48Z","confirmation_sent_at":"2021-08-13T07:31:15Z","app_metadata":{"provider":"email"},"user_metadata":{"full_name":"kfchan103"},"created_at":"2021-08-13T07:31:15Z","updated_at":"2021-08-13T07:31:15Z"}'
    )
  );
  const [isAuthenWidgetOpen, setIsAuthenWidgetOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

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

  useEffect(() => {
    netlifyIdentity.on("open", () => setIsAuthenWidgetOpen(true));
    netlifyIdentity.on("close", () => setIsAuthenWidgetOpen(false));
    netlifyIdentity.on("error", (err) => console.error("Error", err));

    if (authenticatedUser) {
      const intervalId = setInterval(() => {
        const token = authenticatedUser.token;
        const now = Date.now();
        //this.signOut();
        console.log(token.expires_at);
        console.log(now);
        console.log(intervalId);
        if (now >= token.expires_at) {
          console.log("Expired");
          logout();
        }
      }, 5000);

      setIntervalId(intervalId);
    } else clearInterval(intervalId);
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

      {authenticatedUser && !isAuthenWidgetOpen && (
        <div>
          <Dashboard authenticatedUser={authenticatedUser} />
        </div>
      )}
    </div>
  );
}
