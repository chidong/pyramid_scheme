import React, { useContext } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  );
};

const condition = (authUser: any) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
