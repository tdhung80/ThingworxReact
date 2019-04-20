import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";

import "./app.scss";
import "./scripts.js";

import { ViewContext } from "./app.context";

import UserController from "./.core/user.controller";
import HomeController from "./.core/home.controller";

export default () => {
  return (
    <ViewContext>
      <div>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/users/" component={UserController} />
              <Route component={HomeController} />
            </Switch>
          </Suspense>
        </Router>
      </div>
    </ViewContext>
  );
};
