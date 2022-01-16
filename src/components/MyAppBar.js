import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Tooltip from "@material-ui/core/Tooltip";
import MyDrawer from "./MyDrawer";

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

export default function MyAppBar(props) {
  const classes = useStyles();
  const {
    window,
    authenticatedUser,
    isAuthenWidgetOpen,
    onLogin,
    onLogout
  } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const scrollTrigger = useScrollTrigger({
    target: window ? window() : undefined
  });
  const isAppBarOpen = !scrollTrigger && !isAuthenWidgetOpen;

  return (
    <React.Fragment>
      <Slide appear={false} direction="down" in={isAppBarOpen}>
        <AppBar>
          <Toolbar>
            <MyDrawer />
            <Typography align="left" variant="h6" className={classes.title}>
              eSecret
            </Typography>
            {authenticatedUser ? (
              <React.Fragment>
                <Tooltip title={authenticatedUser.email}>
                  <IconButton edge="start" color="inherit" aria-label="user">
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>
                <Button onClick={onLogout} color="inherit">
                  Logout
                </Button>
              </React.Fragment>
            ) : (
              <Button onClick={onLogin} color="inherit">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </React.Fragment>
  );
}
