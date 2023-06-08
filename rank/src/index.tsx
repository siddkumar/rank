import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/authProvider";
import { DbProvider } from "./services/dbProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <DbProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DbProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
