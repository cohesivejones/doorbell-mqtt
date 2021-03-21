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

const AuthenticatedPage = () => {
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
        <LogoutButton />
        {!isInactive && <BuzzerButton />}
        <Timestamps />
      </Container>
    </div>
  );
};

const LandingPage = () => (
  <div>
    <Container maxWidth="md" component="main">
      <CssBaseline />
      <LoginButton />
      <Timestamps />
    </Container>
  </div>
);

const LoadingPage = () => (
  <div>
    <Container maxWidth="md" component="main">
      <CssBaseline />
      <div>Loading ...</div>
    </Container>
  </div>
);

const App = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  if (isLoading) {
    return <LoadingPage />;
  }
  return isAuthenticated ? <AuthenticatedPage /> : <LandingPage />;
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
