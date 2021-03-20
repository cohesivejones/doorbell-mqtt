import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Timestamps } from "./components/Timestamps";
import { BuzzerButton } from "./components/BuzzerButton";
import { DeviceStatus } from "./components/DeviceStatus";
import { useInterval } from "./hooks";

const Doorbell = () => {
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
ReactDOM.render(<Doorbell />, document.getElementById("root"));
