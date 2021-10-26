import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home";

import VideoPage from "./pages/video";

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
}));

const App = () => {
  return (
    <StyledRoot>
      <Router>
        <Switch>
          <Route path="/:roomId" exact>
            <VideoPage />
          </Route>

          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </Router>
    </StyledRoot>
  );
};

export default App;
