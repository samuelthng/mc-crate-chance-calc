import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route path="/:b64?" component={App} />
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
