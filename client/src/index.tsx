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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AlertContextProvider>
        <SocketContextProvider>
          <CssBaseline />
          <App />
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
