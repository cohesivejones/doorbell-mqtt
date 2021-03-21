import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const classes = useStyles();
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Logout
    </Button>
  );
};
