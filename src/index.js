import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import AppLoader from "./app.loader";

const App = lazy(() => import("./app"));

// ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(<AppLoader />, document.getElementById("root"));
ReactDOM.render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
