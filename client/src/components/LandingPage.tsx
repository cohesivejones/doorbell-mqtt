import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Timestamps } from "./Timestamps";

export const LandingPage = () => (
  <Container maxWidth="md" component="main">
    <CssBaseline />
    <Timestamps />
  </Container>
);
