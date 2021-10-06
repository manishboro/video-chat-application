import { makeStyles } from "@mui/styles";

import VideoPlayerOverview from "../../components/video/video-player";

const useStyles = makeStyles({
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#484848",
    position: "fixed",
    inset: 0,
  },
});

const VideoPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <VideoPlayerOverview />
    </div>
  );
};

export default VideoPage;
