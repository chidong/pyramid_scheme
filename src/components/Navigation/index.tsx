import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";
import * as ROLES from "../../constants/roles";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  Container,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  toolbarMargin: theme.mixins.toolbar,
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
  typographyStyles: {
    flex: 1,
  },
}));

const Navigation = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <Container className={classes.navbarDisplayFlex}>
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
            </IconButton>

            <List
              component="nav"
              aria-labelledby="main navigation"
              className={classes.navDisplayFlex}
            >
              <AuthUserContext.Consumer>
                {(authUser) =>
                  authUser ? (
                    <NavigationAuth authUser={authUser} />
                  ) : (
                    <NavigationNonAuth />
                  )
                }
              </AuthUserContext.Consumer>
            </List>
          </Container>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </div>
  );
};

const NavigationAuth = (props: any) => {
  const classes = useStyles();
  return (
    <>
      <ListItem button>
        <Link to={ROUTES.HOME} className={classes.linkText}>
          Home
        </Link>
      </ListItem>
      <ListItem button>
        <Link to={ROUTES.ACCOUNT} className={classes.linkText}>
          Account
        </Link>
      </ListItem>
      {!!props.authUser.roles[ROLES.ADMIN] && (
        <ListItem button>
          <Link to={ROUTES.ADMIN} className={classes.linkText}>
            Admin
          </Link>
        </ListItem>
      )}
      <ListItem button>
        <SignOutButton />
      </ListItem>
    </>
  );
};

const NavigationNonAuth = () => {
  const classes = useStyles();
  return (
    <>
      <ListItem button>
        <Link to={ROUTES.LANDING} className={classes.linkText}>
          Landing
        </Link>
      </ListItem>
      <ListItem button>
        <Link to={ROUTES.SIGN_IN} className={classes.linkText}>
          Sign In
        </Link>
      </ListItem>
      <ListItem button>
        <Link to={ROUTES.SIGN_UP} className={classes.linkText}>
          Sign Up
        </Link>
      </ListItem>
    </>
  );
};

export default Navigation;
