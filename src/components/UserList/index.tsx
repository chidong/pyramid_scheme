import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import TickOrCross from "../ui/TickOrCross";

interface User {
  uid: string;
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

  const userListColumns = [
    {
      name: "uid",
      label: "Uid",
      options: {
        display: "false" as const,
      },
    },
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
          return <TickOrCross state={value} />;
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
          return <TickOrCross state={value} />;
        },
      },
    },
    {
      name: "Actions",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  updateAdmin(
                    tableMeta.rowData[0],
                    !(tableMeta.rowData[3] as boolean)
                  )
                }
              >
                {tableMeta.rowData[3] ? "Revoke Admin" : "Make Admin"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  updateActivated(
                    tableMeta.rowData[0],
                    !(tableMeta.rowData[4] as boolean)
                  )
                }
              >
                {tableMeta.rowData[4] ? "Deactivate" : "Activate"}
              </Button>
            </>
          );
        },
      },
    },
  ];

  const options: any = {
    filterType: "checkbox",
    customToolbarSelect: () => {},
  };

  const updateAdmin = (uid: string, status: boolean) => {
    firebase
      ?.users()
      .child(uid)
      .update({ isAdmin: status })
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  };

  const updateActivated = (uid: string, status: boolean) => {
    firebase
      ?.users()
      .child(uid)
      .update({ isActivated: status })
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {users && (
        <MUIDataTable
          title={"Users List"}
          data={users as any}
          columns={userListColumns}
          options={options}
        />
      )}
    </>
  );
};
