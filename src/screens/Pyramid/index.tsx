import { Card, CardContent, Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import AuthUserContext from "../../components/Session/context";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import withEmailVerification from "../../components/Session/withEmailVerification";
import { withAuthorization } from "../../components/Session";
import { compose } from "recompose";
import { AuthUser } from "../../components/Session/withAuthentication";
import { ChallengeFormDialog } from "../../components/Pyramid/ChallengeFormDialog";
import { ChallengeList } from "../../components/Pyramid/ChallengeList";
import TimeFormatter from "../../components/ui/TimeFormatter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullHeightCard: {
      height: "100px",
      width: "300px",
    },
    currentUserCard: {
      backgroundColor: "green",
    },
  })
);

export interface Ranking {
  id: string;
  userId: string;
  username: string;
  rank: number;
  isInAChallenge: boolean;
  lastLost: Date | null;
  lastWon: Date | null;
  isAbsent: boolean;
  createdAt: Date;
}

const Pyramid = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [rankings, loading, error] = useListVals<Ranking>(
    firebase?.db.ref("rankings"),
    {
      keyField: "id",
    }
  );
  const classes = useStyles();

  const ownRanking = rankings?.find(
    (ranking) => ranking.userId === authUser?.uid
  );

  const canChallenge = (challenger: Ranking, defender: Ranking): boolean => {
    const notYourself = challenger?.userId !== defender.userId;
    const notInAChallenge =
      !challenger?.isInAChallenge && !defender.isInAChallenge;
    const notAbsent = !challenger?.isAbsent && !defender.isAbsent;

    return notYourself && notInAChallenge && notAbsent;
  };

  return (
    <div>
      <h1>Pyramid</h1>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}

      {!loading &&
        rankings &&
        genPyramid(rankings).map((row: Array<Ranking | null>, i) => (
          <Grid container justify="center" spacing={2} key={i}>
            {row.map((ranking: Ranking | null, i) => (
              <Grid item key={i}>
                <Card
                  variant="outlined"
                  className={`${classes.fullHeightCard} ${
                    ranking?.userId === authUser?.uid
                      ? classes.currentUserCard
                      : ""
                  }`}
                >
                  <CardContent>
                    {ranking && (
                      <Grid container direction="column">
                        <Grid item>Rank: {ranking.rank}</Grid>
                        <Grid item> User: {ranking.username}</Grid>
                        <Grid item>
                          Created:{" "}
                          <TimeFormatter dateTime={ranking.createdAt} />
                        </Grid>
                        {canChallenge(ownRanking as Ranking, ranking) && (
                          <ChallengeFormDialog
                            challenger={ownRanking as Ranking}
                            defender={ranking}
                          />
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      <ChallengeList />
    </div>
  );
};

export const genPyramid = (rankings: Ranking[]): Array<Ranking | null>[] => {
  const rows: Array<Ranking | null>[] = [];

  const genRows = (rankings: Ranking[], rowNumber: number = 1) => {
    if (rankings.length <= rowNumber) {
      rows.push(rankings.concat(Array(rowNumber - rankings.length).fill(null)));
    } else {
      const rowElements = rankings.slice(0, rowNumber);
      rows.push(rowElements);
      const remainingElements = rankings.slice(rowNumber);
      genRows(remainingElements, rowNumber + 1);
    }
  };

  genRows(rankings);

  return rows;
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Pyramid);
