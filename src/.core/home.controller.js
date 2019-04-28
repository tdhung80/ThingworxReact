import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "../.ui";
import * as userService from "../services/user.service";

const UserController = lazy(() => import("./user.controller"));

const HomePage = lazy(() => import("./layout/home"));
const LoginView = lazy(() => import("./home/login"));

// TODO: build Context to keep Model

export default withRouter(({ history, location, match }) => {
  const { pathname } = location;
  console.log(`HomeController: ${pathname} ${JSON.stringify(match.params)}`);

  //
  // Actions
  //

  //
  // ActionResult
  //

  if ("/logout" === pathname) {
    userService.logout();
    history.push("/");
  }

  return (
    <HomePage>
      <Switch>
        <Route path="/login" component={LoginView} />
        {/* In this demo, we don't really have a Front App, so we directly go to Back Office App*/}
        <PrivateRoute component={UserController} />
      </Switch>
    </HomePage>
  );
});
