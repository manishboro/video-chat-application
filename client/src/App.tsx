import { makeStyles } from "@mui/styles";

import VideoPlayer from "./components/video-player";
import Sidebar from "./components/sidebar";
import Notifications from "./components/notifications";
import Footer from "./components/footer";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#484848",
    position: "relative",
    top: 0,
    left: 0,
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <VideoPlayer />

        {/* <Sidebar>
          <Notifications />
        </Sidebar> */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
