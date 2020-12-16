import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import AuthUserContext from "../../components/Session/context";
import { Ranking, RankingCard } from "./RankingCard";

export const Pyramid = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [rankings, loading, error] = useListVals<Ranking>(
    firebase?.db.ref("rankings"),
    {
      keyField: "id",
    }
  );

  const ownRanking = rankings?.find(
    (ranking) => ranking.userId === authUser?.uid
  );

  return (
    <div>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}

      {!loading &&
        rankings &&
        genPyramid(rankings).map((row: Array<Ranking | null>, i) => (
          <Grid container justify="center" spacing={2} key={i}>
            {row.map((ranking: Ranking | null, i) => (
              <Grid item key={i}>
                <RankingCard
                  challengerRanking={ownRanking as Ranking}
                  defenderRanking={ranking}
                />
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
