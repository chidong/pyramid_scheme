import {
  Card,
  CardContent,
  Box,
  Typography,
  Tooltip,
  CardActionArea,
  CardActions,
} from "@material-ui/core";
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ChallengeFormDialog } from "../../components/Pyramid/ChallengeFormDialog";
import { GiDuel } from "react-icons/gi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullHeightCard: {
      height: "150px",
      width: "150px",
    },
    currentUserCard: {
      backgroundColor: "#7CFC00",
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
  challengerRanking: Ranking;
  defenderRanking: Ranking | null;
}

const RankingCard = ({
  challengerRanking,
  defenderRanking,
}: RankingCardProps) => {
  const classes = useStyles();

  const canChallenge = (
    challenger: Ranking,
    defender: Ranking | null
  ): boolean => {
    if (!challenger || !defender) {
      return false;
    }
    const notYourself = challenger?.userId !== defender?.userId;
    const notInAChallenge =
      !challenger?.isInAChallenge && !defender?.isInAChallenge;
    const notAbsent = !challenger?.isAbsent && !defender?.isAbsent;

    return notYourself && notInAChallenge && notAbsent;
  };

  return (
    <Card
      variant="outlined"
      className={`${classes.fullHeightCard} ${
        defenderRanking?.userId === challengerRanking?.userId
          ? classes.currentUserCard
          : ""
      }`}
    >
      <CardActionArea>
        <CardContent>
          {defenderRanking && (
            <Box display="flex" flexDirection="column">
              <Box display="flex" flexDirection="row">
                <Box flexGrow={1}>
                  <Typography variant="h6">{defenderRanking.rank}</Typography>
                </Box>
                <Box>
                  {defenderRanking.isInAChallenge && (
                    <Tooltip title="in a challenge">
                      <Box>
                        <GiDuel />
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              <Box>{defenderRanking.username}</Box>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        {defenderRanking &&
          canChallenge(challengerRanking as Ranking, defenderRanking) && (
            <ChallengeFormDialog
              challengerRanking={challengerRanking as Ranking}
              defenderRanking={defenderRanking}
            />
          )}
      </CardActions>
    </Card>
  );
};

export { RankingCard };
