import React from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button, List, ListItemText, Container } from "@material-ui/core";
import { formatTimestamp } from "./utils";
import { useInterval } from "./hooks";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Doorbell = () => {
  const [timestamps, setTimestamps] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const isInactive = status !== "active";

  useInterval(async () => {
    const response = await fetch("/timestamps");
    const data = await response.json();
    setTimestamps(data);
  }, 2000);

  useInterval(async () => {
    const response = await fetch("/status");
    const data = await response.json();
    setStatus(data);
  }, 2000);

  const openDoor = () => fetch("/buzzer", { method: "POST" });
  const classes = useStyles();

  return (
    <div>
      <Alert severity={isInactive ? "info" : "success"}>
        <AlertTitle>
          Device Status: {isInactive ? "INACTIVE" : "ACTIVE"}
        </AlertTitle>
      </Alert>
      <Container maxWidth="md" component="main">
        <CssBaseline />
        {!isInactive && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={openDoor}
          >
            Buzzer
          </Button>
        )}
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
      </Container>
    </div>
  );
};
ReactDOM.render(<Doorbell />, document.getElementById("root"));
