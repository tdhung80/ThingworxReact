import React, { lazy, useState } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { ErrorBoundary } from "../.ui";
import shortid from "shortid";

export default withRouter(({ history }) => {
  const { pathname } = history.location;
  console.log("DemoController: " + pathname);

  const DemoForm = lazy(() => import("." + pathname));

  return (
    <ErrorBoundary>
      <DemoForm />
    </ErrorBoundary>
  );
});
