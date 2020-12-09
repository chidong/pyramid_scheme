import { Button, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../components/Firebase";

export const StartSeasonButton = () => {
  const firebase = useContext(FirebaseContext);
  const [successMessage, setSuccessMessage] = useState("");

  const startNewSeason = () => {
    firebase
      ?.rankings()
      .remove()
      .then(() => {
        firebase
          ?.users()
          .orderByChild("isActivated")
          .equalTo(true)
          .once("value", function (snapshot) {
            let users: any[] = [];

            snapshot.forEach(function (childSnapshot) {
              const key = childSnapshot.key;

              users.push({
                key: key,
              });
            });

            users = users.sort(() => Math.random() - 0.5);

            users.forEach((user, index) => {
              firebase?.rankings().push({
                rank: index + 1,
                userId: user.key,
              });
            });
          })
          .then(() => {
            setSuccessMessage("Successfully created new Season");
          });
      });
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => startNewSeason()}
      >
        Start new Season
      </Button>

      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
    </>
  );
};
