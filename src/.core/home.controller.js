import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "../.ui";
import { userService } from "../services";

const UserController = lazy(() => import("./.core/user.controller"));

const Page = lazy(() => import("./layout/home"));
const LoginPage = lazy(() => import("./home/login"));
const DashboardPage = lazy(() => import("./home/dashboard"));

// TODO: build Context to keep Model

export default withRouter(({ history }) => {
  const { pathname, state } = history.location;
  console.log("HomeController: " + pathname);

  //
  // Actions
  //

  const doLogin = loginView =>
    userService.login(loginView.user, loginView.pass).then(() => {
      console.log("Login success");
      history.push(loginView.from || "/");
    });

  //
  // ActionResult
  //

  if ("/login" === pathname) {
    return <LoginPage onLogin={doLogin} from={state && state.from.pathname} />;
  }

  if ("/logout" === pathname) {
    userService.logout();
    history.push("/");
  }

  return (
    <Page>
      <Switch>
        <PrivateRoute exact path="/" component={DashboardPage} />
        <Route path="/users/" component={UserController} />
        <Route component={NoMatch} />
      </Switch>
    </Page>
  );
});

const NoMatch = withRouter(({ history }) => <h1>No Match: {history.location.pathname}</h1>);
