import React from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MyDrawer from "./MyDrawer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  /*menuButton: {
    marginRight: theme.spacing(2)
  },*/
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
