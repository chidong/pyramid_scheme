import React, { useContext, useEffect } from "react";
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
    name: "isAdmin",
    label: "Admin",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any) => {
        return <div>{value ? "true" : "false"}</div>;
      },
    },
  },
  {
    name: "isActivated",
    label: "Activated",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any) => {
        return <div>{value ? "true" : "false"}</div>;
      },
    },
  },
];

const options: any = {
  filterType: "checkbox",
};

interface User {
  email: string;
  username: string;
  isAdmin: boolean;
  isActivated: boolean;
}

export const UserList = () => {
  const firebase = useContext(FirebaseContext);
  const [users, loading, error] = useListVals<User>(firebase?.db.ref("users"), {
    keyField: "uid",
  });

  useEffect(() => {
    console.log(JSON.stringify(users));
  }, [users]);

  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {users && (
        <MUIDataTable
          title={"Users List"}
          data={users as any}
          columns={userListColums}
          options={options}
        />
      )}
    </>
  );
};
