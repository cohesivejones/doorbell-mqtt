import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const OpenDoorButton = () => {
  const openDoor = () => fetch("/open-door", { method: "POST" });
  const classes = useStyles();
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={openDoor}
    >
      Open Door
    </Button>
  );
};
