import { makeStyles } from "@mui/styles";
import Footer from "../../components/video/footer";
import VideoPlayer from "../../components/video/video-player";

const useStyles = makeStyles({
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
});

const VideoPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <VideoPlayer />
        <Footer />
      </div>
    </div>
  );
};

export default VideoPage;
