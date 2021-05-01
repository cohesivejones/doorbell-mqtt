import React from "react";
import * as ReactDOM from "react-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthenticatedPage, LandingPage, LoadingPage } from "./components";

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
    scope="read:battery read:status write:open-door"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
