import React, { useContext } from "react";
import { compose } from "recompose";
import {
  withAuthorization,
  withEmailVerification,
} from "../../components/Session";
import * as ROLES from "../../constants/roles";
import { useList } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import { AuthUser } from "../../components/Session/withAuthentication";

const Admin = () => {
  const firebase = useContext(FirebaseContext);
  const [users, loading, error] = useList(firebase?.db.ref("users"));

  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {!loading && users && <UserList users={users} />}
    </div>
  );
};

const UserList = ({ users }: { users: any[] | undefined }) => {
  return (
    <ul>
      {users &&
        users.map((user: any, i) => (
          <li key={i}>
            <span>
              <strong>E-Mail:</strong> {user.val().email}
            </span>
            <span>
              <strong>Username:</strong> {user.val().username}
            </span>
          </li>
        ))}
    </ul>
  );
};

const condition = (authUser: AuthUser | null) =>
  (authUser && !!authUser.roles[ROLES.ADMIN]) as boolean;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Admin);
