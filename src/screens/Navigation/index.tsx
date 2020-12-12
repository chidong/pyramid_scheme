import React, { useState, useContext } from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../../components/Session";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  MenuList,
  MenuItem,
  ListItemText,
  Grid,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    toolbarMargin: theme.mixins.toolbar,
    drawer: {
      width: 300,
    },
    fullList: {
      width: "auto",
    },
  })
);

const Navigation: React.FC = (props: any) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const authUser = useContext(AuthUserContext);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsOpen(open);
  };

  const activeRoute = (routeName: string): boolean => {
    return props.location.pathname === routeName ? true : false;
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h5" className={classes.title}>
              Pyramid
            </Typography>

            {authUser ? (
              <SignOutButton />
            ) : (
              <Grid container justify="flex-end" spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={ROUTES.SIGN_IN}
                  >
                    Sign In
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={ROUTES.SIGN_UP}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            )}
          </Toolbar>
        </AppBar>
        <div className={classes.toolbarMargin} />
      </div>
      <Drawer
        classes={{ paper: classes.drawer }}
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <div
          className={classes.fullList}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuList>
            {!authUser && (
              <NavLink to={ROUTES.LANDING} style={{ textDecoration: "none" }}>
                <MenuItem selected={activeRoute(ROUTES.LANDING)}>
                  <ListItemText primary="HOME" />
                </MenuItem>
              </NavLink>
            )}
            {authUser && (
              <div>
                <NavLink to={ROUTES.HOME} style={{ textDecoration: "none" }}>
                  <MenuItem selected={activeRoute(ROUTES.HOME)}>
                    <ListItemText primary="HOME" />
                  </MenuItem>
                </NavLink>
                <NavLink to={ROUTES.PYRAMID} style={{ textDecoration: "none" }}>
                  <MenuItem selected={activeRoute(ROUTES.PYRAMID)}>
                    <ListItemText primary="PYRAMID" />
                  </MenuItem>
                </NavLink>
                <NavLink to={ROUTES.ACCOUNT} style={{ textDecoration: "none" }}>
                  <MenuItem selected={activeRoute(ROUTES.ACCOUNT)}>
                    <ListItemText primary="ACCOUNT" />
                  </MenuItem>
                </NavLink>
              </div>
            )}

            {authUser && authUser.isAdmin && (
              <NavLink to={ROUTES.ADMIN} style={{ textDecoration: "none" }}>
                <MenuItem selected={activeRoute(ROUTES.ADMIN)}>
                  <ListItemText primary="ADMIN" />
                </MenuItem>
              </NavLink>
            )}
            <NavLink to={ROUTES.CONTACT} style={{ textDecoration: "none" }}>
              <MenuItem selected={activeRoute(ROUTES.CONTACT)}>
                <ListItemText primary="CONTACT" />
              </MenuItem>
            </NavLink>
            <NavLink to={ROUTES.ABOUT} style={{ textDecoration: "none" }}>
              <MenuItem selected={activeRoute(ROUTES.ABOUT)}>
                <ListItemText primary="ABOUT" />
              </MenuItem>
            </NavLink>
          </MenuList>
        </div>
      </Drawer>
    </>
  );
};

export default withRouter(Navigation);
