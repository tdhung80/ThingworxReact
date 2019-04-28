import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./app.scss";
import "./app.react.scss";
import "./app.mdb.scss";
import "./app.mui.scss";
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
