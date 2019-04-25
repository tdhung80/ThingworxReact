import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./app.scss";
import "./app.react.scss";
import "./app.mdb.scss";
// import "./scripts.js";

import { ViewContext } from "./app.context";
import { configureFakeBackend } from "./services";
import HomeController from "./.core/home.controller";
const AppLoader = lazy(() => import("./app.loader"));
const DemoForm = lazy(() => import("./.core/demo/form"));
const DemoGrid = lazy(() => import("./.core/demo/grid"));

configureFakeBackend();

export default () => {
  console.log("App Loaded");

  return (
    <ViewContext>
      <Router>
        <Suspense fallback={<AppLoader />}>
          <Switch>
            <Route path="/demo/form" component={DemoForm} />
            <Route exact path="/" component={DemoGrid} />
            <Route component={HomeController} />
          </Switch>
        </Suspense>
      </Router>
    </ViewContext>
  );
};
