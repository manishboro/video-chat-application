import { makeStyles } from "@mui/styles";

import { useSocketContext } from "../../../context/SocketContext";
import Footer from "../footer";

const useStyles = makeStyles({
  videoContainerRoot: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  videoContainer: {
    width: "100%",
    height: "calc(100vh - 15rem)",
    margin: "auto",
    position: "relative",
  },

  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transform: "rotateY(180deg)",
  },

  name: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    zIndex: 10,
  },
});

type VideoRef = React.LegacyRef<HTMLVideoElement> | undefined;

export const VideoPlayer = ({ videoRef }: { videoRef: VideoRef }) => {
  const classes = useStyles();

  return <video playsInline muted ref={videoRef} autoPlay className={classes.video} />;
};

const VideoPlayerOverview = () => {
  const classes = useStyles();
  const ctx = useSocketContext();

  return (
    ctx && (
      <div className={classes.videoContainerRoot}>
        <div className={classes.videoContainer} ref={ctx.videoPlayer}>
          {/* Our own video */}
          {ctx.ctxData.stream && <VideoPlayer videoRef={ctx.myVideo} />}
          {/* Other user's video */}
          {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && <VideoPlayer videoRef={ctx.myVideo} />}
        </div>
        <Footer />
      </div>
    )
  );
};

export default VideoPlayerOverview;
