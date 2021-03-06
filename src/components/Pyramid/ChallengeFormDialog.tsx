import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FirebaseContext } from "../../components/Firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Alert } from "@material-ui/lab";
import { Ranking } from "./RankingCard";

interface ChallengeProps {
  challengeDate: Date;
  location: string;
}

const ChallengeSchema = Yup.object().shape({
  challengeDate: Yup.date().required("required"),
  location: Yup.string().required("required"),
});

interface ChallengeFormDialogProps {
  challengerRanking: Ranking;
  defenderRanking: Ranking;
}

export const ChallengeFormDialog = ({
  challengerRanking,
  defenderRanking,
}: ChallengeFormDialogProps) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, errors } = useForm<ChallengeProps>({
    resolver: yupResolver(ChallengeSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = handleSubmit((data) => {
    // Create Challenge
    firebase
      ?.challenges()
      .push({
        challengerId: challengerRanking.userId,
        challengerName: challengerRanking.username,
        challengerRankingId: challengerRanking.id,
        defenderId: defenderRanking.userId,
        defenderName: defenderRanking.username,
        defenderRankingId: defenderRanking.id,
        challengeDate: Date.parse(data.challengeDate.toString()),
        location: data.location,
        createdAt: firebase.serverValue.TIMESTAMP,
        isAccepted: false,
        isRecorded: false,
      })
      .catch((error: any) => {
        setError(error);
      });
    //Update Challenger rank
    firebase
      ?.rankings()
      .child(challengerRanking.id)
      .update({ isInAChallenge: true });
    //Update Defender rank
    firebase
      ?.rankings()
      .child(defenderRanking.id)
      .update({ isInAChallenge: true });

    handleClose();
  });

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Challenge
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Challenge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Challenge {defenderRanking?.username}
          </DialogContentText>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              id="challengeDate"
              label="Challenge Date"
              name="challengeDate"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.challengeDate ? true : false}
              helperText={errors.challengeDate?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              name="location"
              label="Location"
              id="location"
              autoComplete="location"
              error={errors.location ? true : false}
              helperText={errors.location?.message}
            />

            {error && <Alert severity="error">{(error as any).message}</Alert>}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
