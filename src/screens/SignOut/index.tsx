import React, { useContext } from "react";
import { FirebaseContext } from "../../components/Firebase";
import { Button } from "@material-ui/core";

const SignOutButton = () => {
  const firebase = useContext(FirebaseContext);

  return (
    <Button variant="contained" color="secondary" onClick={firebase?.doSignOut}>
      Sign Out
    </Button>
  );
};
export default SignOutButton;
