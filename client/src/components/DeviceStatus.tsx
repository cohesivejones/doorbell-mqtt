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

const severity = (isInactive: boolean) => (isInactive ? "info" : "success");
const status = (isInactive: boolean) =>
  `Device Status: ${isInactive ? "INACTIVE" : "ACTIVE"}`;

type Props = {
  isInactive : boolean
}
export const DeviceStatus : React.FC<Props> = ({ isInactive }) => {
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
