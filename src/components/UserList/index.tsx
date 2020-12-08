import React, { useContext, useEffect, useMemo } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import MUIDataTable from "mui-datatables";

const userListColums = [
  {
    name: "username",
    label: "Username",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "roles",
    label: "Roles",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "activated",
    label: "Activated",
    options: {
      filter: true,
      sort: false,
    },
  },
];

const options: any = {
  filterType: "checkbox",
};

interface User {
  email: string;
  username: string;
  roles?: {};
}

export const UserList = () => {
  const firebase = useContext(FirebaseContext);
  const [users, loading, error] = useListVals<User>(firebase?.db.ref("users"), {
    keyField: "uid",
  });

  const userList = useMemo(() => {
    return users?.map((user) => ({
      ...user,
      roles: Object.keys(user.roles ? user.roles : {}),
    }));
  }, [users]);

  useEffect(() => {
    console.log(JSON.stringify(userList));
  }, [userList]);

  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {userList && (
        <MUIDataTable
          title={"Users List"}
          data={userList as any}
          columns={userListColums}
          options={options}
        />
      )}
    </>
  );
};
