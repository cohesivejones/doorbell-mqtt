import React, { useState } from "react";
import { formatTimestamp } from "../utils";
import { useInterval } from "./hooks";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { NotificationsActive, TouchApp } from "@material-ui/icons";

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
        <List dense={true}>
          {timestamps.map(({ timestamp, open }) => (
            <ListItem key={timestamp}>
              <ListItemIcon>
                {open ? <TouchApp /> : <NotificationsActive />}
              </ListItemIcon>
              <ListItemText
                primary={formatTimestamp(timestamp)}
                secondary={open ? "(Opened)" : "(Buzzed)"}
              />
            </ListItem>
          ))}
        </List>
      </section>
    </div>
  );
};
