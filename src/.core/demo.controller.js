import React, { lazy } from "react";
import { withRouter } from "react-router-dom";
import ErrorBoundary from "../.ui/ErrorBoundary";
import Page from "./layout/blank";

export default withRouter(({ location, match: { params } }) => {
  const { pathname } = location;
  console.log(`DemoController: ${pathname} ${JSON.stringify(params)}`);

  const DemoForm = lazy(() => import("." + pathname + ".js"));

  return (
    <Page>
      <ErrorBoundary>
        <DemoForm />
      </ErrorBoundary>
    </Page>
  );
});
