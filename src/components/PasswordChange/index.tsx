import React, { useContext, useState } from "react";
import { FirebaseContext } from "../Firebase";

const PasswordChangeForm = (props: any) => {
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent) => {
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswordOne("");
        setPasswordTwo("");
        setError(null);
      })
      .catch((error: any) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={(e) => setPasswordOne(e.currentTarget.value)}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={(e) => setPasswordTwo(e.currentTarget.value)}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{(error as any).message}</p>}
    </form>
  );
};

export default PasswordChangeForm;
