import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase";

interface User {
  uid: string;
  email: string;
  username: string;
}

const Admin = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setLoading(true);

    props.firebase.users().on("value", (snapshot: any) => {
      const usersObject = snapshot.val();

      const usersList: User[] = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      setUsers(usersList);
      setLoading(false);
    });

    return () => {
      props.firebase.users().off();
    };
  }, [props.firebase]);

  return (
    <div>
      <h1>Admin</h1>
      {loading && <div>Loading ...</div>}
      <UserList users={users} />
    </div>
  );
};

const UserList = (props: any) => (
  <ul>
    {props.users.map((user: User) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(Admin);
