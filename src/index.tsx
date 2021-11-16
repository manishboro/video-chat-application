import { ThemeProvider } from "@mui/system";
import ReactDOM from "react-dom";
import App from "./app";
import "./styles/styles.css";
import theme from "./styles/theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
