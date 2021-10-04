import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";

import { useSocketContext } from "../../context/SocketContext";

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    width: "100%",
    height: "calc(100vh - 10rem)",
    margin: "1rem",
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
}));

const VideoPlayer = () => {
  const classes = useStyles();
  const ctx = useSocketContext();

  return (
    ctx && (
      <div className={classes.videoContainer}>
        {ctx.ctxData.stream && (
          <>
            <Typography variant="h5" gutterBottom className={classes.name}>
              {ctx.ctxData.name || "Name"}
            </Typography>
            <video playsInline muted ref={ctx.myVideo} autoPlay className={classes.video}></video>
          </>
        )}

        {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && (
          <>
            <Typography variant="h5" gutterBottom>
              {ctx.ctxData.call.name || "Name"}
            </Typography>
            <video playsInline ref={ctx.userVideo} autoPlay className={classes.video} />
          </>
        )}
      </div>
    )
  );
};

export default VideoPlayer;
