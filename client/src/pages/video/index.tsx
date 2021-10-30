import VideoPlayerOverview from "../../components/video/video-player-overview";
import WebRTCContextProvider from "../../context/WebRTCContext";
import { useStyles } from "./styles";

const VideoPage = () => {
  const classes = useStyles();

  return (
    <WebRTCContextProvider>
      <div className={classes.root}>
        <VideoPlayerOverview />
      </div>
    </WebRTCContextProvider>
  );
};

export default VideoPage;
