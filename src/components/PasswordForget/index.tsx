import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { Button, LinearProgress } from "@material-ui/core";

interface PasswordForgetProps {
  email: string;
}

const initialValues: PasswordForgetProps = {
  email: "",
};

const PasswordForgetSchema = Yup.object().shape({
  email: Yup.string().required("required").email(),
});

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetForm = () => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const handleSubmit = (values: PasswordForgetProps, actions: any): void => {
    firebase
      ?.doPasswordReset(values.email)
      .then(() => {
        setError(null);
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
      validationSchema={PasswordForgetSchema}
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
            {isSubmitting && <LinearProgress />}

            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={!dirty || !isValid || isSubmitting}
              onClick={submitForm}
            >
              Reset Password
            </Button>

            {error && <p>{(error as any).message}</p>}
          </Form>
        );
      }}
    </Formik>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
