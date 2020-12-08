import React, { useContext } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../../components/Session";

import PasswordChangeForm from "../PasswordChange";
import { AuthUser } from "../../components/Session/withAuthentication";

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <div>
      <h1>Account: {authUser?.email}</h1>
      <h2>Reset Password</h2>
      <PasswordChangeForm />
    </div>
  );
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
