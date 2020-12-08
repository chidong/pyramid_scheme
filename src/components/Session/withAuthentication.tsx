import React, { useState, useEffect, useContext } from "react";

import AuthUserContext from "./context";
import { FirebaseContext } from "../Firebase";

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  providerData: any[];
  roles: any;
  username: string;
}

const withAuthentication = (Component: React.FunctionComponent) => {
  const WithAuthentication = (props: any) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(
      JSON.parse(localStorage.getItem("authUser") as string)
    );
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
      const listener = firebase?.onAuthUserListener(
        (authUser: AuthUser) => {
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
    }, [firebase]);

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return WithAuthentication;
};

export default withAuthentication;
