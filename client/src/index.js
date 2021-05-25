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

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUTH_AUDIENCE}
    scope="read:battery read:status write:open-door"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
