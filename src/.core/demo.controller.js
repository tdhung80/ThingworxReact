import React, { lazy } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { PrivateRoute } from "../.ui";
import ErrorBoundary from "../.ui/ErrorBoundary";
import Page from "./layout/blank";
import * as service from "../services/user.service";

export default withRouter(({ location, match: { params } }) => {
  const { pathname } = location;
  console.log(`DemoController: ${pathname} ${JSON.stringify(params)}`);

  const DemoForm = lazy(() => import("." + pathname + ".js"));

  // Use NTLM
  service.loginAsAnonymous();

  return (
    <Page>
      <ErrorBoundary>
        <Switch>
          <PrivateRoute exact path="/demo/service" component={DemoForm} />
          <Route component={DemoForm} />
        </Switch>
      </ErrorBoundary>
    </Page>
  );
});
