import React from "react";
import { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import netlifyIdentity from "netlify-identity-widget";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function HideOnScroll(props) {
  const { children, window, isAuthenticating } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  console.log(isAuthenticating);
  //<Slide appear={false} direction="down" in={!trigger}>
  const isIn = !trigger && !isAuthenticating;

  return (
    <Slide appear={false} direction="down" in={isIn}>
      {children}
    </Slide>
  );
}

export default function App() {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const netlifyAuth = {
    isAuthenticated: false,
    user: null,
    authenticate(callback) {
      this.isAuthenticated = true;
      netlifyIdentity.open();
      netlifyIdentity.on("login", (user) => {
        this.user = user;
        callback(user);
      });
      //callback();
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

  const login = () => {
    console.log("login");
    setIsAuthenticating(true);
    netlifyAuth.authenticate(() => {
      console.log("authenticated");
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    });
  };
  const logout = () => {
    console.log("logout");
    netlifyAuth.signout(() => {
      console.log("signouted");
      setIsAuthenticated(false);
    });
  };

  return (
    <div className="App">
      <CssBaseline />
      <HideOnScroll isAuthenticating={isAuthenticating} {...this?.props}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography align="left" variant="h6" className={classes.title}>
              eSecret
            </Typography>
            {isAuthenticated ? (
              <Button onClick={logout} color="inherit">
                Logout
              </Button>
            ) : (
              <Button onClick={login} color="inherit">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <span>{`isAuthenticating: ${isAuthenticating}`}</span>
      <Button onClick={() => setIsAuthenticating(!isAuthenticating)}>
        test
      </Button>
      {isAuthenticated && (
        <div>
          <Dashboard />
        </div>
      )}
    </div>
  );
}
