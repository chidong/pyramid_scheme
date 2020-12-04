import React, { useContext, useState } from "react";
import { FirebaseContext } from "../Firebase";
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

interface PasswordChangeProps {
  passwordOne: string;
  passwordTwo: string;
}

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
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
  } = useForm<PasswordChangeProps>({
    resolver: yupResolver(PasswordChangeSchema),
  });

  const onSubmit = handleSubmit((data) => {
    firebase
      ?.doPasswordUpdate(data.passwordOne)
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
          Password Change
        </Typography>
        <form className={""} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register}
            required
            fullWidth
            name="passwordOne"
            label="Password"
            type="password"
            id="passwordOne"
            autoComplete="current-passwordOne"
            error={errors.passwordOne ? true : false}
            helperText={errors.passwordOne?.message}
            disabled={formState.isSubmitting}
            onFocus={() => setIsSuccessfullySubmitted(false)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register}
            required
            fullWidth
            name="passwordTwo"
            label="Repeat Password"
            type="password"
            id="passwordTwo"
            autoComplete="current-passwordTwo"
            error={errors.passwordTwo ? true : false}
            helperText={errors.passwordTwo?.message}
            disabled={formState.isSubmitting}
          />

          {error && <Alert severity="error">{(error as any).message}</Alert>}
          {isSuccessfullySubmitted && (
            <Alert severity="success">Password changed successfully</Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={""}
            disabled={formState.isSubmitting || isSuccessfullySubmitted}
          >
            Change Password
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default PasswordChangeForm;
