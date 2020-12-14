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
import { Ranking } from "../../screens/Pyramid/index";
import { useForm } from "react-hook-form";
import { Alert } from "@material-ui/lab";

interface ChallengeProps {
  challengerId: string;
  defenderId: string;
  challengeDate: Date;
  location: string;
}

const ChallengeSchema = Yup.object().shape({
  challengerId: Yup.string().required("required"),
  defenderId: Yup.string().required("required"),
  challengeDate: Yup.date().required("required"),
  location: Yup.string().required("required"),
});

export interface ChallengeFormDialogProps {
  challenger: Ranking;
  defender: Ranking;
}

export const ChallengeFormDialog = ({
  challenger,
  defender,
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
    firebase?.challenges().push({
      challengerId: data.challengerId,
      defenderId: data.defenderId,
      challengeDate: Date.parse(data.challengeDate.toString()),
      location: data.location,
      createdAt: firebase.serverValue.TIMESTAMP,
    });
    //Update Challenger rank
    firebase?.rankings().child(challenger.id).update({ isInAChallenge: true });
    //Update Defender rank
    firebase?.rankings().child(defender.id).update({ isInAChallenge: true });

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
          <DialogContentText>Challenge to the max</DialogContentText>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              id="challengerId"
              label="Challenger"
              name="challengerId"
              autoComplete="challengerId"
              defaultValue={challenger.userId}
              autoFocus
              error={errors.challengerId ? true : false}
              helperText={errors.challengerId?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register}
              required
              fullWidth
              id="defenderId"
              label="Defender"
              name="defenderId"
              autoComplete="defenderId"
              defaultValue={defender.userId}
              error={errors.defenderId ? true : false}
              helperText={errors.defenderId?.message}
            />
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
