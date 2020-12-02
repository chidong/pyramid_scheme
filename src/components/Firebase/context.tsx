import React from "react";
import Firebase from "./index";

const FirebaseContext = React.createContext<Firebase | null>(null);

export default FirebaseContext;
