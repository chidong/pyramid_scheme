import { Grid, Typography } from "@material-ui/core";
import React from "react";
import withEmailVerification from "../../components/Session/withEmailVerification";
import { withAuthorization } from "../../components/Session";
import { compose } from "recompose";
import { AuthUser } from "../../components/Session/withAuthentication";
import { ChallengeList } from "../../components/Pyramid/ChallengeList";

import { Pyramid } from "../../components/Pyramid/Pyramid";

const PyramidPage = () => {
  return (
    <Grid container direction="column" spacing={4}>
      <Grid item justify="center">
        <Typography variant="h4">Pyramid</Typography>
      </Grid>
      <Grid item>
        <Pyramid />
      </Grid>
      <Grid item>
        <ChallengeList />
      </Grid>
    </Grid>
  );
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(PyramidPage);
