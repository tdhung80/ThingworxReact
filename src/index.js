import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

import { configureFakeBackend } from "./services";
configureFakeBackend();

ReactDOM.render(<App />, document.getElementById("root"));
