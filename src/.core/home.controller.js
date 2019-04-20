import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { userService } from "../services";
import LoginPage from "./home/login";
import { PrivateRoute } from "../.ui";
const DashboardPage = lazy(() => import("./home/dashboard"));

// TODO: build Context to keep Model

export default withRouter(({ history }) => {
  const path = history.location.pathname;
  const state = history.location.state;
  console.log("HomeController: " + path);

  const doLogin = loginView => {
    return userService.login(loginView.user, loginView.pass).then(() => {
      console.log("Login success");
      history.push(loginView.from || "/");
    });
  };

  if ("/login" === path) {
    return <LoginPage onLogin={doLogin} from={state && state.from.pathname} />;
  }

  if ("/logout" === path) {
    userService.logout();
    history.push("/");
  }

  return (
    <Switch>
      <PrivateRoute exact path="/" component={DashboardPage} />
      <Route component={NoMatch} />
    </Switch>
  );
});

const NoMatch = withRouter(({ history }) => (
  <h3>No Match: {history.location.pathname}</h3>
));
