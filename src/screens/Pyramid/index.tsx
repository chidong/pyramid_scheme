import { Button, Card, CardContent, Grid } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import AuthUserContext from "../../components/Session/context";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

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

interface Ranking {
  id: string;
  userId: string;
  username: string;
  rank: number;
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

  const canChallenge = (challengerId: string, defenderId: string): boolean => {
    return challengerId !== defenderId;
  };

  return (
    <div>
      <h1>Pyramid</h1>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}

      {rankings &&
        genPyramid(rankings).map((row: Array<Ranking | null>) => (
          <Grid container justify="center" spacing={2}>
            {row.map((ranking: Ranking | null) => (
              <Grid item>
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
                        {canChallenge(
                          authUser?.uid as string,
                          ranking?.userId
                        ) && (
                          <Button variant="outlined" color="primary">
                            Challenge
                          </Button>
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
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

export default Pyramid;
