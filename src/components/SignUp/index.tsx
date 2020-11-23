import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const SignUpFormBase = (props: any) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = (event: React.FormEvent) => {
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        setUsername("");
        setEmail("");
        setPasswordOne("");
        setPasswordTwo("");
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch((error: any) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={(e) => setPasswordOne(e.currentTarget.value)}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={(e) => setPasswordTwo(e.currentTarget.value)}
        type="password"
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{(error as any).message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
