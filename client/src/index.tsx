import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import SocketContextProvider from "./context/SocketContext";
import AlertContextProvider from "./context/AlertContext";
import App from "./App";
import theme from "./styles/theme";

import reportWebVitals from "./reportWebVitals";
import ModalContextProvider from "./context/ModalContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AlertContextProvider>
        <SocketContextProvider>
          <ModalContextProvider>
            <CssBaseline />
            <App />
          </ModalContextProvider>
        </SocketContextProvider>
      </AlertContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
