import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import VideoPage from "./pages/video";

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
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

          <Route path="/admin-video">
            <VideoPage />
          </Route>

          <Route path="/user-video">
            <VideoPage />
          </Route>
        </Switch>
      </Router>
    </StyledRoot>
  );
};

export default App;
