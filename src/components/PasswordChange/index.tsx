import React, { useContext, useState } from "react";
import { FirebaseContext } from "../Firebase";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { Button, LinearProgress } from "@material-ui/core";

interface PasswordChangeProps {
  passwordOne: string;
  passwordTwo: string;
}

const initialValues: PasswordChangeProps = {
  passwordOne: "",
  passwordTwo: "",
};

const PasswordChangeSchema = Yup.object().shape({
  passwordOne: Yup.string().min(6, "min 6 characters").required("required"),
  passwordTwo: Yup.string()
    .min(6, "min 6 characters")
    .required("required")
    .oneOf([Yup.ref("passwordOne")], "passwords have to match"),
});

const PasswordChangeForm = () => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);

  const handleSubmit = (values: PasswordChangeProps, actions: any): void => {
    firebase
      ?.doPasswordUpdate(values.passwordOne)
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
      validationSchema={PasswordChangeSchema}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => {
        return (
          <Form>
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

export default PasswordChangeForm;
