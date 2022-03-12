import React from "react";
import ReactDOM from "react-dom";
// eslint-disable-next-line
import adapter from "webrtc-adapter";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import App from "./App";
import theme from "./styles/theme";

import reportWebVitals from "./reportWebVitals";
import UserContextProvider from "./context/UserContext";
import ModalContextProvider from "./context/ModalContext";
import AlertContextProvider from "./context/AlertContext";
import AuthContextProvider from "./context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <AlertContextProvider>
          <AuthContextProvider>
            <ModalContextProvider>
              <UserContextProvider>
                <CssBaseline />
                <App />
              </UserContextProvider>
            </ModalContextProvider>
          </AuthContextProvider>
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
