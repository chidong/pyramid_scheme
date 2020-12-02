import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

//import { withFirebase } from "../Firebase";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetForm = (props: any) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent) => {
    firebase
      ?.doPasswordReset(email)
      .then(() => {
        setEmail("");

        setError(null);
      })
      .catch((error: any) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{(error as any).message}</p>}
    </form>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
