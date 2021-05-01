import React, { useState } from "react";
import { formatTimestamp } from "../utils";
import { useInterval } from "./hooks";
import { List, ListItemText } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
}));

export const Timestamps = () => {
  const classes = useStyles();
  const [timestamps, setTimestamps] = useState([]);
  useInterval(async () => {
    const response = await fetch("/timestamps");
    const data = await response.json();
    setTimestamps(data);
  }, 2000);

  return (
    <div className={classes.paper}>
      <section>
        <Typography component="h3" variant="h5">
          Activation times
        </Typography>
        <List>
          {timestamps.map((timestamp) => (
            <ListItemText key={timestamp}>
              {formatTimestamp(timestamp)}
            </ListItemText>
          ))}
        </List>
      </section>
    </div>
  );
};
