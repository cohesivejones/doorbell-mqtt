import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";

export const LoadingPage = () => (
  <div>
    <Container maxWidth="md" component="main">
      <CssBaseline />
      <div>Loading ...</div>
    </Container>
  </div>
);
