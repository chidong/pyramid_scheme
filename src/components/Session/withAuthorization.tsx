import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { FirebaseContext } from "../Firebase";
import AuthUserContext from "./context";
import * as ROUTES from "../../constants/routes";

const withAuthorization = (condition: (authUser: any) => boolean) => (
  Component: React.FC
) => {
  const WithAuthorization = (props: any) => {
    const firebase = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);

    useEffect(() => {
      const listener = firebase.onAuthUserListener(
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

    return condition(authUser) ? <Component {...props} /> : null;
  };

  return compose(withRouter)(WithAuthorization);
};

export default withAuthorization;
