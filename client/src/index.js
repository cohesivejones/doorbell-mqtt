import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Timestamps } from "./components/Timestamps";
import { BuzzerButton } from "./components/BuzzerButton";
import { DeviceStatus } from "./components/DeviceStatus";
import { useInterval } from "./hooks";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./components/LoginButton";
import { LogoutButton } from "./components/LogoutButton";

const Main = () => {
  const { isAuthenticated } = useAuth0();
  const [status, setStatus] = useState("");
  const isInactive = status !== "active";
  useInterval(async () => {
    const response = await fetch("/status");
    const data = await response.json();
    setStatus(data);
  }, 2000);

  return (
    <div>
      <DeviceStatus isInactive={isInactive} />
      <Container maxWidth="md" component="main">
        <CssBaseline />
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && <LogoutButton />}
        {!isInactive && <BuzzerButton />}
        <Timestamps />
      </Container>
    </div>
  );
};

const App = () => {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  } else {
    return <Main />;
  }
};

ReactDOM.render(
  <Auth0Provider
    domain="dev-p6s2vrvp.us.auth0.com"
    clientId="5RmbMQK7Dv9lTPbvTey7K4eCgJ2gtWfH"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
