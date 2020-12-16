import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import MUIDataTable from "mui-datatables";
import TimeFormatter from "../ui/TimeFormatter";
import TickOrCross from "../ui/TickOrCross";
import { AuthUser } from "../Session/withAuthentication";
import { Button } from "@material-ui/core";
import { AuthUserContext } from "../../components/Session";
import { RegisterChallengeResultDialog } from "./RegisterChallengeResultsDialog";

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerRankingId: string;
  defenderId: string;
  defenderName: string;
  defenderRankingId: string;
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
  const authUser = useContext(AuthUserContext);
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
    {
      name: "Actions",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <>
              {!tableMeta.rowData[7] && tableMeta.rowData[3] === authUser?.uid && (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => acceptChallenge(tableMeta.rowData[0])}
                  >
                    Accept Challenge
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      declineChallenge(
                        challenges?.find(
                          (challenge) => challenge.id === tableMeta.rowData[0]
                        ) as Challenge
                      )
                    }
                  >
                    Decline Challenge
                  </Button>
                </>
              )}
              {!tableMeta.rowData[8] &&
                (tableMeta.rowData[1] === authUser?.uid ||
                  tableMeta.rowData[3] === authUser?.uid) && (
                  <RegisterChallengeResultDialog
                    challenge={
                      challenges?.find(
                        (challenge) => challenge.id === tableMeta.rowData[0]
                      ) as Challenge
                    }
                  />
                )}
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

  const acceptChallenge = (challengeId: string) => {
    firebase
      ?.challenges()
      .child(challengeId)
      .update({ isAccepted: true })
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  };

  const declineChallenge = (challenge: Challenge) => {
    firebase
      ?.challenges()
      .child(challenge.id)
      .remove()
      .then(() => {
        //Update Challenger rank
        firebase
          ?.rankings()
          .child(challenge.challengerRankingId)
          .update({ isInAChallenge: false });
        //Update Defender rank
        firebase
          ?.rankings()
          .child(challenge.defenderRankingId)
          .update({ isInAChallenge: false });
      })
      .catch((e) => {
        console.log(e);
      });
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
