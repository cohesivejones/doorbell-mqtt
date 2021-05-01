import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { useInterval } from "./hooks";
import { useAuth0 } from "@auth0/auth0-react";
import { Timestamps } from "./Timestamps";
import { OpenDoorButton } from "./OpenDoorButton";
import { DeviceStatus } from "./DeviceStatus";
import { LogoutButton } from "./LogoutButton";

export const AuthenticatedPage = () => {
  const [status, setStatus] = useState("");
  const isInactive = status !== "active";
  const { getAccessTokenSilently } = useAuth0();

  useInterval(async () => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH_AUDIENCE,
      scope: "read:status",
    });
    const response = await fetch("/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setStatus(data);
  }, 2000);

  return (
    <div>
      <DeviceStatus isInactive={isInactive} />
      <Container maxWidth="md" component="main">
        <CssBaseline />
        <LogoutButton />
        {!isInactive && <OpenDoorButton />}
        <Timestamps />
      </Container>
    </div>
  );
};
