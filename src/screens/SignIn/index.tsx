import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { FirebaseContext } from "../../components/Firebase";
import * as ROUTES from "../../constants/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Button,
  Avatar,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useForm } from "react-hook-form";
import { useSignInSignUpStyles } from "../../components/Styles/SignInSignUpStyles";

interface SignInProps {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().required("required").email(),
  password: Yup.string().required("required"),
});

const SignInPage = () => <SignInForm />;

const SignInFormBase = (props: any) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);
  const classes = useSignInSignUpStyles();

  const { register, handleSubmit, errors } = useForm<SignInProps>({
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = handleSubmit((data) => {
    firebase
      ?.doSignInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch((error: any) => {
        setError(error);
      });
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
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
            autoFocus
            error={errors.email ? true : false}
            helperText={errors.email?.message}
          />
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errors.password ? true : false}
            helperText={errors.password?.message}
          />

          {error && <Alert severity="error">{(error as any).message}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <PasswordForgetLink />
            </Grid>
            <Grid item>
              <SignUpLink />
            </Grid>
          </Grid>
        </form>
      </div>
      <SignInGoogle />
    </Container>
  );
};

const SignInGoogleBase = (props: any) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);
  const classes = useSignInSignUpStyles();

  const onSubmit = (event: React.FormEvent) => {
    firebase
      ?.doSignInWithGoogle()
      .then((socialAuthUser: any) => {
        // Create a user in your Firebase Realtime Database too
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          return firebase.user(socialAuthUser.user.uid).update({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign In with Google
      </Button>
      {error && <p>{(error as any).message}</p>}
    </form>
  );
};

const SignInForm = compose(withRouter)(SignInFormBase);

const SignInGoogle = compose(withRouter)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };
