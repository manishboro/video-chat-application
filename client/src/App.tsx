import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/home";

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  // backgroundColor: "#484848",
  position: "relative",
  top: 0,
  left: 0,
}));

const App = () => {
  return (
    <StyledRoot>
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </StyledRoot>
  );
};

export default App;
