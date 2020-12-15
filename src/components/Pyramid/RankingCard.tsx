import { Card, CardContent, Grid } from "@material-ui/core";
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ChallengeFormDialog } from "../../components/Pyramid/ChallengeFormDialog";
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

interface RankingCardProps {
  challenger: Ranking;
  defender: Ranking;
}

const RankingCard = ({ challenger, defender }: RankingCardProps) => {
  const classes = useStyles();

  const canChallenge = (challenger: Ranking, defender: Ranking): boolean => {
    const notYourself = challenger?.userId !== defender.userId;
    const notInAChallenge =
      !challenger?.isInAChallenge && !defender.isInAChallenge;
    const notAbsent = !challenger?.isAbsent && !defender.isAbsent;

    return notYourself && notInAChallenge && notAbsent;
  };

  return (
    <Card
      variant="outlined"
      className={`${classes.fullHeightCard} ${
        defender?.userId === challenger?.userId ? classes.currentUserCard : ""
      }`}
    >
      <CardContent>
        {defender && (
          <Grid container direction="column">
            <Grid item>Rank: {defender.rank}</Grid>
            <Grid item>User: {defender.username}</Grid>
            <Grid item>
              Created: <TimeFormatter dateTime={defender.createdAt} />
            </Grid>
            {canChallenge(challenger as Ranking, defender) && (
              <ChallengeFormDialog
                challenger={challenger as Ranking}
                defender={defender}
              />
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export { RankingCard };
