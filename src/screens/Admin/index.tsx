import React from "react";
import { compose } from "recompose";
import {
  withAuthorization,
  withEmailVerification,
} from "../../components/Session";
import * as ROLES from "../../constants/roles";
import { AuthUser } from "../../components/Session/withAuthentication";
import { UserList } from "../../components/UserList/index";

const Admin = () => {
  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>

      <UserList />
    </div>
  );
};

const condition = (authUser: AuthUser | null) =>
  (authUser && !!authUser.roles[ROLES.ADMIN]) as boolean;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Admin);
