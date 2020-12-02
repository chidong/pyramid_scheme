import React, { useState, useEffect, useContext } from "react";

import AuthUserContext from "./context";
import { FirebaseContext } from "../Firebase";

const withAuthentication = (Component: React.FunctionComponent) => {
  const WithAuthentication = (props: any) => {
    const [authUser, setAuthUser] = useState(
      JSON.parse(localStorage.getItem("authUser") as string)
    );
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
      const listener = firebase?.onAuthUserListener(
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
        if (listener) {
          listener();
        }
      };
    });

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return WithAuthentication;
};

export default withAuthentication;
