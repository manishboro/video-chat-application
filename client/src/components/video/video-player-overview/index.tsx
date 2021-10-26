import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { nanoid } from "nanoid";

import { useSocketContext } from "../../../context/SocketContext";
import { useUserContext } from "../../../context/UserContext";
import VideoPlayer from "../video-player";

const useStyles = makeStyles({
  videoContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& > div": { margin: "1rem" },
  },

  name: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    zIndex: 10,
  },

  joinMeetingContainer: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translate(-50%, -20px)",
    fontSize: "18px",
    backgroundColor: "white",
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    fontFamily: "Montserrat",
  },
});

const VideoPlayerOverview = () => {
  const classes = useStyles();
  const ctx = useSocketContext();
  const userCtx = useUserContext();

  console.log(ctx?.ctxData.call?.displayName);

  return (
    ctx && (
      <>
        <div className={classes.videoContainer} ref={ctx.videoPlayer}>
          {/* Our own video */}
          {ctx.ctxData.stream && (
            <VideoPlayer
              videoRef={ctx.myVideo}
              audioBool={ctx.ctxData.audio}
              videoBool={ctx.ctxData.video}
              displayName={userCtx?.displayName}
              updateMic={ctx.updateMic}
              updateVideo={ctx.updateVideo}
            />
          )}

          {/* Other user's video */}
          {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && (
            <VideoPlayer
              videoRef={ctx.userVideo}
              audioBool={ctx.ctxData.userAudio}
              displayName={ctx.ctxData.call?.displayName}
              videoBool={ctx.ctxData.userVideo}
            />
          )}

          {ctx && ctx.ctxData.call?.isReceivingCall && !ctx.ctxData.callAccepted && (
            <div className={classes.joinMeetingContainer}>
              <p>{ctx.ctxData.call?.displayName} wants to join</p>
              <Button variant="contained" color="primary" onClick={ctx.answerCall} style={{ marginLeft: "20px" }}>
                Accept
              </Button>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", top: 0, zIndex: 100 }}>
          {ctx?.ctxData.myRoom.map(
            (id) =>
              id !== ctx.ctxData.me && (
                <button key={nanoid()} onClick={() => ctx.callUser(id)}>
                  Call {id}
                </button>
              )
          )}
        </div>
      </>
    )
  );
};

export default VideoPlayerOverview;
