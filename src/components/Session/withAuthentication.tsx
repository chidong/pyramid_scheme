import React, { useState, useEffect } from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component: React.FunctionComponent) => {
  const WithAuthentication = (props: any) => {
    const [authUser, setAuthUser] = useState(
      JSON.parse(localStorage.getItem("authUser") as string)
    );

    useEffect(() => {
      const listener = props.firebase.onAuthUserListener(
        (authUser: any) => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          setAuthUser(authUser);
        },
        () => {
          localStorage.removeItem("authUser");
          setAuthUser(null);
        }
      );

      return () => {
        listener();
      };
    });

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
