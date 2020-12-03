import React, { useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { compose } from "recompose";
import { FirebaseContext } from "../Firebase";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { Button, LinearProgress } from "@material-ui/core";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

interface SignUpProps {
  email: string;
  username: string;
  passwordOne: string;
  passwordTwo: string;
  isAdmin: boolean;
}

const initialValues: SignUpProps = {
  email: "",
  username: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
};

const SignUpSchema = Yup.object().shape({
  username: Yup.string().min(4, "min 4 characters").required("required"),
  email: Yup.string().required("required").email(),
  passwordOne: Yup.string().min(6, "min 6 characters").required("required"),
  passwordTwo: Yup.string()
    .min(6, "min 6 characters")
    .required("required")
    .oneOf([Yup.ref("passwordOne")], "passwords have to match"),
  isAdmin: Yup.bool(),
});

const SignUpFormBase = (props: any) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const handleSubmit = (values: SignUpProps, actions: any): void => {
    const roles: any = {};
    if (values.isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    firebase
      ?.doCreateUserWithEmailAndPassword(values.email, values.passwordOne)
      .then((authUser: any) => {
        // Create a user in your Firebase realtime database
        return firebase.user(authUser.user.uid).set({
          username: values.username,
          email: values.email,
          roles,
        });
      })
      .then(() => {
        return firebase.doSendEmailVerification();
      })
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
      validationSchema={SignUpSchema}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => {
        return (
          <Form>
            <Field
              component={TextField}
              name="username"
              type="text"
              label="Username"
            />
            <br />
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
              name="passwordOne"
            />
            <br />
            <Field
              component={TextField}
              type="password"
              label="Repeat Password"
              name="passwordTwo"
            />
            <br />
            <Field
              component={CheckboxWithLabel}
              type="checkbox"
              name="isAdmin"
              Label={{ label: "Admin" }}
            />
            {isSubmitting && <LinearProgress />}

            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={!dirty || !isValid || isSubmitting}
              onClick={submitForm}
            >
              Sign Up
            </Button>

            {error && <p>{(error as any).message}</p>}
          </Form>
        );
      }}
    </Formik>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
