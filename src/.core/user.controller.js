import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";

export default withRouter(({ history }) => {
  const path = history.location.pathname;
  console.log("UserController: " + path);

  return (
    // <Switch>
    //   <Route path="/user/login" component={LoginPage} />
    // </Switch>
    <div>Users Page</div>
  );
});
