import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { LoginButton } from "./LoginButton";
import { Timestamps } from "./Timestamps";

export const LandingPage = () => (
  <div>
    <Container maxWidth="md" component="main">
      <CssBaseline />
      <LoginButton />
      <Timestamps />
    </Container>
  </div>
);
