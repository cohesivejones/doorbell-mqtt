import React from "react";
import * as ReactDOM from "react-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  AuthenticatedPage,
  LandingPage,
  LoginButton,
  LogoutButton,
} from "./components";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Config } from "./config";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const { isAuthenticated } = useAuth0();
  const classes = useStyles();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Doorbell @ Dr Nate
          </Typography>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Toolbar>
      </AppBar>
      {isAuthenticated ? <AuthenticatedPage /> : <LandingPage />}
    </>
  );
};

const config = new Config();
ReactDOM.render(
  <Auth0Provider
    domain={config.authDomain()}
    clientId={config.authClientId()}
    redirectUri={window.location.origin}
    audience={config.authAudience()}
    scope="read:battery read:status write:open-door"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
