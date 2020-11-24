import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import AuthUserContext from "./context";
import * as ROUTES from "../../constants/routes";

const withAuthorization = (condition: (authUser: any) => boolean) => (
  Component: React.FC
) => {
  const WithAuthorization = (props: any) => {
    useEffect(() => {
      const listener = props.firebase.onAuthUserListener(
        (authUser: any) => {
          if (!condition(authUser)) {
            props.history.push(ROUTES.SIGN_IN);
          }
        },
        () => props.history.push(ROUTES.SIGN_IN)
      );

      return () => {
        listener();
      };
    });

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (condition(authUser) ? <Component {...props} /> : null)}
      </AuthUserContext.Consumer>
    );
  };

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
