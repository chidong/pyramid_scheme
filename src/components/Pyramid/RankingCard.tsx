import { Card, CardContent, Box, Typography, Tooltip } from "@material-ui/core";
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ChallengeFormDialog } from "../../components/Pyramid/ChallengeFormDialog";
import { GiDuel } from "react-icons/gi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullHeightCard: {
      height: "100px",
      width: "300px",
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
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row">
              <Box flexGrow={1}>
                <Typography variant="h6">{defender.rank}</Typography>
              </Box>
              <Box>
                {defender.isInAChallenge && (
                  <Tooltip title="in a challenge">
                    <Box>
                      <GiDuel />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box>User: {defender.username}</Box>

            {canChallenge(challenger as Ranking, defender) && (
              <ChallengeFormDialog
                challenger={challenger as Ranking}
                defender={defender}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export { RankingCard };
