import React from "react";
import { render } from "react-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./slices";

import "./index.css";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
