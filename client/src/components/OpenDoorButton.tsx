import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";
import { LockOpen } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(5, 5, 5),
  },
}));

export const OpenDoorButton = () => {
  const { getAccessTokenSilently } = useAuth0();
  const onClick = useCallback(async () => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH_AUDIENCE,
      scope: "write:open-door",
    });
    await fetch("/open-door", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [getAccessTokenSilently]);
  const classes = useStyles();
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={onClick}
    >
      Open Door
      <LockOpen />
    </Button>
  );
};
