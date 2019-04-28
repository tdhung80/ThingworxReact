import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import AppLoader from "./app.loader";
//import * as serviceWorker from './serviceWorker';

const App = lazy(() => import("./app"));

// ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(<AppLoader />, document.getElementById("root"));
ReactDOM.render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
