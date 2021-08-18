import React from "react";
import { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import netlifyIdentity from "netlify-identity-widget";
import MyAppBar from "./components/MyAppBar";

export default function App() {
  const defaultUser = localStorage.getItem("gotrue.user");
  console.log(defaultUser);
  const [authenticatedUser, setAuthenticatedUser] = useState(defaultUser);
  const [isAuthenWidgetOpen, setIsAuthenWidgetOpen] = useState(false);

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

  const login = () => {
    console.log("login");
    netlifyAuth.authenticate((user) => {
      console.log("login successfully");
      setAuthenticatedUser(user);
    });
  };
  const logout = () => {
    console.log("logout");
    netlifyAuth.signout(() => {
      console.log("logout successfully");
      setAuthenticatedUser(null);
    });
  };

  netlifyIdentity.on("open", () => setIsAuthenWidgetOpen(true));
  netlifyIdentity.on("close", () => setIsAuthenWidgetOpen(false));

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
          <Dashboard />
        </div>
      )}
    </div>
  );
}
