import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "../.ui";

const UserPage = lazy(() => import("./layout/user"));
const DashboardView = lazy(() => import("./user/dashboard"));

export default withRouter(({ history, location, match: { params } }) => {
  const { pathname } = location;
  console.log(`UserController: ${pathname} ${JSON.stringify(params)}`);

  return (
    <UserPage>
      <Switch>
        <PrivateRoute component={DashboardView} />
      </Switch>
    </UserPage>
  );
});

// const NoMatch = withRouter(({ history }) => <h1>No Match: {history.location.pathname}</h1>);
