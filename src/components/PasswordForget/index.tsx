import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useForm } from "react-hook-form";

interface PasswordForgetProps {
  email: string;
}

const PasswordForgetSchema = Yup.object().shape({
  email: Yup.string().required("required").email(),
});

const PasswordForgetPage = () => <PasswordForgetForm />;

const PasswordForgetForm = () => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
  } = useForm<PasswordForgetProps>({
    resolver: yupResolver(PasswordForgetSchema),
  });

  const onSubmit = handleSubmit((data) => {
    firebase
      ?.doPasswordReset(data.email)
      .then(() => {
        setError(null);
        setIsSuccessfullySubmitted(true);
      })
      .catch((error: any) => {
        setError(error);
        setIsSuccessfullySubmitted(false);
      });
    reset();
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={""}>
        <Typography component="h1" variant="h5">
          Send New Password Link
        </Typography>
        <form className={""} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={errors.email ? true : false}
            helperText={errors.email?.message}
            disabled={formState.isSubmitting}
            onFocus={() => setIsSuccessfullySubmitted(false)}
            autoFocus
          />

          {error && <Alert severity="error">{(error as any).message}</Alert>}
          {isSuccessfullySubmitted && (
            <Alert severity="success">Send Password Link successfully</Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={""}
            disabled={formState.isSubmitting || isSuccessfullySubmitted}
          >
            Send Password Link
          </Button>
        </form>
      </div>
    </Container>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
