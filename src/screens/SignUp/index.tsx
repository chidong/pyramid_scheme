import React, { useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { compose } from "recompose";
import { FirebaseContext } from "../../components/Firebase";
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
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useForm } from "react-hook-form";
import { useSignInSignUpStyles } from "../../components/Styles/SignInSignUpStyles";
import { SignInGoogle } from "../SignIn";

const SignUpPage = () => <SignUpForm />;

interface SignUpProps {
  email: string;
  username: string;
  passwordOne: string;
  passwordTwo: string;
  isAdmin: boolean;
}

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
  const classes = useSignInSignUpStyles();

  const { register, handleSubmit, errors } = useForm<SignUpProps>({
    resolver: yupResolver(SignUpSchema),
  });

  const onSubmit = handleSubmit((data) => {
    firebase
      ?.doCreateUserWithEmailAndPassword(data.email, data.passwordOne)
      .then((authUser: any) => {
        // Create a user in your Firebase realtime database
        return firebase.user(authUser.user.uid).set({
          username: data.username,
          email: data.email,
          isAdmin: data.isAdmin,
          isActivated: false,
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
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register}
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={errors.username ? true : false}
            helperText={errors.username?.message}
          />
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
          />
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
          />
          <FormControlLabel
            control={
              <Checkbox name="isAdmin" color="primary" inputRef={register} />
            }
            label="Admin"
          />

          {error && <Alert severity="error">{(error as any).message}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to={ROUTES.SIGN_IN}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
        <SignInGoogle />
      </div>
    </Container>
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
