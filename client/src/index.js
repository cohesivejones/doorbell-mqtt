import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Timestamps } from "./components/Timestamps";
import { BuzzerButton } from "./components/BuzzerButton";
import { DeviceStatus } from "./components/DeviceStatus";
import { useInterval } from "./hooks";
import { Auth0Provider } from "@auth0/auth0-react";

const App = () => {
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
        {!isInactive && <BuzzerButton />}
        <Timestamps />
      </Container>
    </div>
  );
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
