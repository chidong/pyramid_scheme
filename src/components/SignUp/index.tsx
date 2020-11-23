import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

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

  const onChange = (event: React.FormEvent) => {
    switch ((event.target as HTMLInputElement).name) {
      case "username":
        setUsername((event.target as HTMLInputElement).value);
        break;
      case "email":
        setEmail((event.target as HTMLInputElement).value);
        break;
      case "passwordOne":
        setPasswordOne((event.target as HTMLInputElement).value);
        break;
      case "passwordTwo":
        setPasswordTwo((event.target as HTMLInputElement).value);
        break;
      default:
      // code block
    }
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
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
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

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
