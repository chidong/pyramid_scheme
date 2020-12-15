import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import MUIDataTable from "mui-datatables";
import TimeFormatter from "../ui/TimeFormatter";
import TickOrCross from "../ui/TickOrCross";
import { AuthUser } from "../Session/withAuthentication";

interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  defenderId: string;
  defenderName: string;
  challengeDate: Date;
  location: string;
  isAccepted: boolean;
  isRecorded: boolean;
}

interface ChallengeListProps {
  user?: AuthUser;
}

export const ChallengeList = ({ user }: ChallengeListProps) => {
  const firebase = useContext(FirebaseContext);
  const [challenges, loading, error] = useListVals<Challenge>(
    firebase?.db.ref("challenges"),
    {
      keyField: "id",
    }
  );

  let challengesList;

  if (user) {
    challengesList = challenges?.filter(
      (challenge) =>
        challenge.challengerId === user.uid || challenge.defenderId === user.uid
    );
  } else {
    challengesList = challenges;
  }

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
        display: "false" as const,
      },
    },
    {
      name: "challengerName",
      label: "Challenger",
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
        display: "false" as const,
      },
    },
    {
      name: "defenderName",
      label: "Defender",
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
    {
      name: "isAccepted",
      label: "Accepted",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => {
          return <TickOrCross state={value} />;
        },
      },
    },
    {
      name: "isRecorded",
      label: "Recorded",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => {
          return <TickOrCross state={value} />;
        },
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
      {challengesList && (
        <MUIDataTable
          title={"Challenge List"}
          data={challengesList as any}
          columns={userListColumns}
          options={options}
        />
      )}
    </>
  );
};
