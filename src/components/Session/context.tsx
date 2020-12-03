import React from "react";
import { AuthUser } from "./withAuthentication";

const AuthUserContext = React.createContext<AuthUser | null>(null);

export default AuthUserContext;
