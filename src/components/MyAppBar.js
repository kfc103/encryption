import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

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
    <Slide appear={false} direction="down" in={isAppBarOpen}>
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
          <Typography align="left" variant="h6" className={classes.title}>
            {authenticatedUser?.email}
          </Typography>
          {authenticatedUser ? (
            <Button onClick={onLogout} color="inherit">
              Logout
            </Button>
          ) : (
            <Button onClick={onLogin} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
