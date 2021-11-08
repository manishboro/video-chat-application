import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import { HashRouter as Router } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import App from "./App";
import theme from "./styles/theme";

import reportWebVitals from "./reportWebVitals";
import UserContextProvider from "./context/UserContext";
import ModalContextProvider from "./context/ModalContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <ModalContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </ModalContextProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
