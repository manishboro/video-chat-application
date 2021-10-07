import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useSocketContext } from "../../../context/SocketContext";
import Footer from "../footer";
import VideoPlayer from "../video-player";

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
    // position: "relative",
    display: "flex",
    justifyContent: "center",

    "& video": {
      margin: "2rem",
    },
  },

  name: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    zIndex: 10,
  },
});

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
          {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && <VideoPlayer videoRef={ctx.userVideo} />}
        </div>

        {ctx && ctx.ctxData.call?.isReceivingCall && !ctx.ctxData.callAccepted && (
          <div style={{ position: "absolute", top: 0, fontSize: "2rem" }}>
            <h1>{ctx.ctxData.call?.displayName} is calling:</h1>
            <Button variant="contained" color="primary" onClick={ctx.answerCall}>
              Answer
            </Button>
          </div>
        )}

        <Footer />
      </div>
    )
  );
};

export default VideoPlayerOverview;
