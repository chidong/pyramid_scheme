import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { Button, LinearProgress } from "@material-ui/core";

interface SignInProps {
  email: string;
  password: string;
}

const initialValues: SignInProps = {
  email: "",
  password: "",
};

const SignInSchema = Yup.object().shape({
  email: Yup.string().required("required").email(),
  password: Yup.string().required("required"),
});

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <br />
    <SignInGoogle />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const SignInFormBase = (props: any) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const handleSubmit = (values: SignInProps, actions: any): void => {
    firebase
      ?.doSignInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch((error: any) => {
        setError(error);
      });
    actions.setSubmitting(false);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={SignInSchema}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => {
        return (
          <Form>
            <Field
              component={TextField}
              name="email"
              type="email"
              label="Email"
            />
            <br />
            <Field
              component={TextField}
              type="password"
              label="Password"
              name="password"
            />
            <br />
            {isSubmitting && <LinearProgress />}

            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={!dirty || !isValid || isSubmitting}
              onClick={submitForm}
            >
              Sign In
            </Button>

            {error && <p>{(error as any).message}</p>}
          </Form>
        );
      }}
    </Formik>
  );
};

const SignInGoogleBase = (props: any) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent) => {
    firebase
      ?.doSignInWithGoogle()
      .then((socialAuthUser: any) => {
        // Create a user in your Firebase Realtime Database too
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          return firebase.user(socialAuthUser.user.uid).set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          });
        }
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch((error: any) => {
        setError(error);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>
      {error && <p>{(error as any).message}</p>}
    </form>
  );
};

const SignInForm = compose(withRouter)(SignInFormBase);

const SignInGoogle = compose(withRouter)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };
