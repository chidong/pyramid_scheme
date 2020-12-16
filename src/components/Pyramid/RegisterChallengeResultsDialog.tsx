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
import { Challenge } from "./ChallengeList";

interface RegisterChallengeResultsProps {
  challengerScore: number;
  defenderScore: number;
}

const RegisterChallengeResultsSchema = Yup.object().shape({
  challengerScore: Yup.number().min(0).max(3).required("required"),
  defenderScore: Yup.number()
    .min(0)
    .max(3)
    .required("required")
    .notOneOf([Yup.ref("challengerScore")], "Someone has to win"),
});

interface RegisterChallengeResultDialogProps {
  challenge: Challenge;
}

export const RegisterChallengeResultDialog = ({
  challenge,
}: RegisterChallengeResultDialogProps) => {
  const [error, setError] = useState(null);
  const firebase = useContext(FirebaseContext);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
  } = useForm<RegisterChallengeResultsProps>({
    resolver: yupResolver(RegisterChallengeResultsSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = handleSubmit((data) => {
    // Update Challenge
    firebase
      ?.challenges()
      .child(challenge.id)
      .update({
        challengerScore: data.challengerScore,
        defenderScore: data.defenderScore,
        isRecorded: true,
      })
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
      .catch((error: any) => {
        setError(error);
      });

    handleClose();
  });

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Register Results
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Register Challenge Results
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {challenge.challengerName} vs. {challenge.defenderName}
          </DialogContentText>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              id="challengerScore"
              label={challenge.challengerName}
              name="challengerScore"
              type="number"
              error={errors.challengerScore ? true : false}
              helperText={errors.challengerScore?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              id="defenderScore"
              label={challenge.defenderName}
              name="defenderScore"
              type="number"
              error={errors.defenderScore ? true : false}
              helperText={errors.defenderScore?.message}
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
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
