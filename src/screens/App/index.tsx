import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import Contact from "../Contact";
import About from "../About";
import { Grid } from "@material-ui/core";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../../components/Session";
import PyramidPage from "../Pyramid";

const App = () => (
  <BrowserRouter>
    <Grid container direction="column">
      <Grid item container>
        <Navigation />
      </Grid>

      <Grid item container>
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Switch>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              exact
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.PYRAMID} component={PyramidPage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.CONTACT} component={Contact} />
            <Route exact path={ROUTES.ABOUT} component={About} />
            <Redirect from="*" to="/" />
          </Switch>
        </Grid>
        <Grid item xs={false} sm={2} />
      </Grid>
    </Grid>
  </BrowserRouter>
);

export default withAuthentication(App);
