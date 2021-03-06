import React, { useState } from "react";
import { useInterval } from "./hooks";
import { useAuth0 } from "@auth0/auth0-react";
import {
  BatteryAlert as Battery0,
  Battery20,
  Battery30,
  Battery50,
  Battery60,
  Battery80,
  Battery90,
  BatteryFull as Battery100,
} from "@material-ui/icons";

export const Battery = () => {
  const [battery, setBattery] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  useInterval(async () => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH_AUDIENCE,
      scope: "read:battery",
    });
    const response = await fetch("/battery", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setBattery(data);
  }, 2000);

  if (battery < 20) {
    return <Battery0 />;
  } else if (battery < 30) {
    return <Battery20 />;
  } else if (battery < 50) {
    return <Battery30 />;
  } else if (battery < 60) {
    return <Battery50 />;
  } else if (battery < 80) {
    return <Battery60 />;
  } else if (battery < 90) {
    return <Battery80 />;
  } else if (battery < 100) {
    return <Battery90 />;
  } else {
    return <Battery100 />;
  }
};
