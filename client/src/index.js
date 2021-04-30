import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Timestamps } from "./components/Timestamps";
import { OpenDoorButton } from "./components/OpenDoorButton";
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
        {!isInactive && <OpenDoorButton />}
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
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUTH_AUDIENCE}
    scope="write:open-door"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
