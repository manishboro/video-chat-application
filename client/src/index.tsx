import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";

import AlertContextProvider from "./context/AlertContext";
import App from "./App";
import theme from "./styles/theme";

import reportWebVitals from "./reportWebVitals";
import ModalContextProvider from "./context/ModalContext";
import UserContextProvider from "./context/UserContext";
import { CssBaseline } from "@mui/material";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <AlertContextProvider>
          <UserContextProvider>
            <ModalContextProvider>
              <CssBaseline />
              <App />
            </ModalContextProvider>
          </UserContextProvider>
        </AlertContextProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
