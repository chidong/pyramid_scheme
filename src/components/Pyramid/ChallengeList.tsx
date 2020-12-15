import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import MUIDataTable from "mui-datatables";
import TimeFormatter from "../ui/TimeFormatter";

interface Challenge {
  id: string;
  challengerId: string;
  defenderId: string;
  challengeDate: Date;
  location: string;
}

export const ChallengeList = () => {
  const firebase = useContext(FirebaseContext);
  const [challenges, loading, error] = useListVals<Challenge>(
    firebase?.db.ref("challenges"),
    {
      keyField: "id",
    }
  );

  const userListColumns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "false" as const,
      },
    },
    {
      name: "challengerId",
      label: "challengerId",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "defenderId",
      label: "defenderId",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "challengeDate",
      label: "challengeDate",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => {
          return (
            <div>
              <TimeFormatter dateTime={value} />
            </div>
          );
        },
      },
    },
    {
      name: "location",
      label: "location",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const options: any = {
    filterType: "checkbox",
    customToolbarSelect: () => {},
  };

  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {challenges && (
        <MUIDataTable
          title={"Challenge List"}
          data={challenges as any}
          columns={userListColumns}
          options={options}
        />
      )}
    </>
  );
};
