// import { Button } from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import { nanoid } from "nanoid";

// import { useSocketContext } from "../../../context/SocketContext";
// import { useUserContext } from "../../../context/UserContext";
// import VideoPlayer from "../video-player";

// const useStyles = makeStyles({
//   videoContainer: {
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",

//     "& > div": { margin: "1rem" },
//   },

//   name: {
//     position: "absolute",
//     bottom: "1rem",
//     left: "1rem",
//     zIndex: 10,
//   },

//   joinMeetingContainer: {
//     position: "absolute",
//     top: "20px",
//     left: "50%",
//     transform: "translate(-50%, -20px)",
//     fontSize: "18px",
//     backgroundColor: "white",
//     padding: "10px 15px",
//     display: "flex",
//     alignItems: "center",
//     borderRadius: "5px",
//     fontFamily: "Montserrat",
//   },
// });

// const VideoPlayerOverview = () => {
//   const classes = useStyles();
//   const ctx = useSocketContext();
//   const userCtx = useUserContext();

//   console.log(ctx?.ctxData.callerDetails?.displayName);

//   return (
//     ctx && (
//       <>
//         <div className={classes.videoContainer} ref={ctx.videoPlayer}>
//           {/* Our own video */}
//           {ctx.ctxData.myStream && (
//             <VideoPlayer
//               videoRef={ctx.myVideo}
//               audioBool={ctx.ctxData.myAudioOn}
//               videoBool={ctx.ctxData.myVideoOn}
//               displayName={userCtx?.displayName}
//               updateMic={ctx.updateMic}
//               updateVideo={ctx.updateVideo}
//             />
//           )}

//           {/* Other user's video */}
//           {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && (
//             <VideoPlayer
//               videoRef={ctx.userVideo}
//               displayName={ctx.ctxData.callerDetails?.displayName ?? ctx.ctxData.receiverDetails?.displayName}
//               audioBool={ctx.ctxData.userAudioOn}
//               videoBool={ctx.ctxData.userVideoOn}
//             />
//           )}

//           {ctx && ctx.ctxData.callerDetails?.isReceivingCall && !ctx.ctxData.callAccepted && (
//             <div className={classes.joinMeetingContainer}>
//               <p>{ctx.ctxData.callerDetails?.displayName} wants to join</p>
//               <Button variant="contained" color="primary" onClick={ctx.answerCall} style={{ marginLeft: "20px" }}>
//                 Accept
//               </Button>
//             </div>
//           )}
//         </div>

//         <div style={{ position: "absolute", top: 0, zIndex: 100 }}>
//           {ctx?.ctxData.myRoom.map(
//             (id) =>
//               id !== ctx.ctxData.mySocketId && (
//                 <button key={nanoid()} onClick={() => ctx.callUser(id)}>
//                   Call {id}
//                 </button>
//               )
//           )}
//         </div>
//       </>
//     )
//   );
// };

// export default VideoPlayerOverview;

import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { nanoid } from "nanoid";

import { useUserContext } from "../../../context/UserContext";
import { useWebRtcCtx } from "../../../context/WebRTCContext";
import VideoPlayer, { MicAndVideo } from "../video-player";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
  },

  root_1: {
    width: "100%",
    height: "calc(100vh - 80px)",
    display: "flex",
  },

  root_2: {
    width: "100%",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  videoContainer: {
    width: "100%",
    height: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",

    "@media (max-width: 960px)": { flexDirection: "column" },
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

  sidebar: {
    width: "300px",
    height: "100%",
    backgroundColor: "white",
  },
});

const VideoPlayerOverview = () => {
  const classes = useStyles();
  const userCtx = useUserContext();
  const webRtcCtx = useWebRtcCtx();

  return webRtcCtx ? (
    <div className={classes.root}>
      <div className={classes.root_1}>
        <div className={classes.videoContainer}>
          {/* Our own video */}
          <VideoPlayer
            videoRef={webRtcCtx.localStreamRef}
            displayName={userCtx?.displayName}
            showMicAndVideo={false}
            muted={true}
            isVisible={true}
            // updateMic={ctx.updateMic}
            // updateVideo={ctx.updateVideo}
          />

          {/* 
            Remote user's video. 
            Only show when the call is accepted.
          */}
          <VideoPlayer
            videoRef={webRtcCtx.remoteStreamRef}
            displayName={webRtcCtx.callerDetails?.displayName ?? webRtcCtx.receiverDetails?.displayName}
            audioBool={false}
            videoBool={false}
            showMicAndVideo={true}
            disableMicAndVideoBtn={true}
            isVisible={webRtcCtx.isCallAccepted}
            muted={false}
          />

          {webRtcCtx.isReceivingCall && !webRtcCtx.isCallAccepted && (
            <div className={classes.joinMeetingContainer}>
              <p>{webRtcCtx.callerDetails?.displayName} is calling</p>
              <Button variant="contained" color="primary" onClick={() => webRtcCtx.answerCall()} style={{ marginLeft: "20px" }}>
                Accept
              </Button>
            </div>
          )}

          {!webRtcCtx.isCallAccepted && (
            <div style={{ position: "absolute", top: 0, zIndex: 100 }}>
              {webRtcCtx.myRoom.map(
                (id: any) =>
                  id !== webRtcCtx.mySocketId && (
                    <button key={nanoid()} onClick={() => webRtcCtx.makeCall(id)}>
                      Call {id}
                    </button>
                  )
              )}
            </div>
          )}
        </div>

        {/* <div className={classes.sidebar}></div> */}
      </div>

      <div className={classes.root_2}>
        <MicAndVideo audioBool={true} videoBool={true} />
      </div>
    </div>
  ) : null;
};

export default VideoPlayerOverview;
