import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./app.ui.scss";
import "./app.ui-react.scss";
import "./app.ui-mdb.scss";
import "./app.ui-mui.scss";
import "./app.ui-bootstrap.scss";
import "./app.ui-animation.scss";
// import "./scripts.js";

import { ViewContext } from "./app.context";
import HomeController from "./.core/home.controller";
const AppLoader = lazy(() => import("./app.loader"));
const DemoController = lazy(() => import("./.core/demo.controller"));

export default () => {
  console.log("App Loaded");

  return (
    <ViewContext>
      <Router>
        <Suspense fallback={<AppLoader />}>
          <Switch>
            <Route path="/demo/" component={DemoController} />
            <Route component={HomeController} />
          </Switch>
        </Suspense>
      </Router>
    </ViewContext>
  );
};
