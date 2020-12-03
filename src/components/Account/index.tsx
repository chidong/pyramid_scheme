import React, { useContext } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { AuthUser } from "../Session/withAuthentication";

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <div>
      <h1>Account: {authUser?.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  );
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
