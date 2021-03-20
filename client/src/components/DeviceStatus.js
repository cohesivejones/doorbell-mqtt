import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Battery } from "./Battery";

const useStyles = makeStyles((theme) => ({
  alert: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "space-between",
  },
}));

const severity = (isInactive) => (isInactive ? "info" : "success");
const status = (isInactive) =>
  `Device Status: ${isInactive ? "INACTIVE" : "ACTIVE"}`;

export const DeviceStatus = ({ isInactive }) => {
  const classes = useStyles();
  return (
    <Alert severity={severity(isInactive)} variant="filled">
      <AlertTitle>
        <div className={classes.alert}>
          <div>{status(isInactive)}</div>
          <Battery />
        </div>
      </AlertTitle>
    </Alert>
  );
};
