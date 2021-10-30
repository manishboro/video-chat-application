import React from "react";
import { nanoid } from "nanoid";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

import VideoPlayerOverview from "../../components/video/video-player-overview";
import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import SocketContextProvider, { useSocketContext } from "../../context/SocketContext";
import { setItemToStorage } from "../../utils/localStorage";
import { ButtonsContainer, StyledForm, useStyles } from "./styles";
import { useModalContext } from "../../context/ModalContext";
import { copyTextToClipboard } from "../../utils/copyTextToClipboard";
import { useAlertContext } from "../../context/AlertContext";
import WebRTCContextProvider from "../../context/WebRTCContext";

// const NewMeetingForm: React.FC<{ handleClose(): void }> = ({ handleClose }) => {
//   const ctx = useSocketContext();
//   const alert = useAlertContext();
//   const roomIDRef = React.useRef<any>(null);

//   return (
//     <StyledForm
//       onSubmit={(e) => {
//         e.preventDefault();
//         copyTextToClipboard(roomIDRef.current);
//         alert?.handleAlertProps("severity", "success");
//         alert?.handleAlertProps("showAlert", true);
//         alert?.handleSnackbar("Room ID copied");
//         handleClose();
//       }}
//     >
//       <CustomTextField
//         id="displayName"
//         label="Display Name"
//         value={ctx?.ctxData.displayName}
//         labelWidth={100}
//         required={true}
//         handleChange={(e) => {
//           ctx?.handleSetData("displayName", e.target.value);
//           setItemToStorage("displayName", e.target.value ?? "");
//         }}
//       />

//       <CustomTextField
//         id="roomId"
//         label="Room ID"
//         customRef={roomIDRef}
//         value={ctx?.ctxData.me}
//         labelWidth={100}
//         required={true}
//         disabled={true}
//       />

//       <CustomButton text="Copy Room ID" rootStyles={{ borderRadius: ".5rem" }} Icon={ContentCopyIcon} type="submit" />
//     </StyledForm>
//   );
// };

// const JoinMeetingForm: React.FC<{ handleClose(): void }> = ({ handleClose }) => {
//   const ctx = useSocketContext();
//   const alert = useAlertContext();
//   const [idToCall, setIDToCall] = React.useState("");

//   return (
//     <StyledForm
//       onSubmit={(e) => {
//         e.preventDefault();
//         ctx?.callUser(idToCall);
//         alert?.handleAlertProps("severity", "info");
//         alert?.handleAlertProps("showAlert", true);
//         alert?.handleSnackbar("Please wait while your call is getting accepted!");
//         handleClose();
//       }}
//     >
//       <CustomTextField
//         id="displayName"
//         label="Display Name"
//         value={ctx?.ctxData.displayName}
//         labelWidth={100}
//         required={true}
//         handleChange={(e) => {
//           ctx?.handleSetData("displayName", e.target.value);
//           setItemToStorage("displayName", e.target.value ?? "");
//         }}
//       />

//       <CustomTextField
//         id="personToCall"
//         label="Enter Room ID"
//         value={idToCall}
//         handleChange={(e) => setIDToCall(e.target.value)}
//         labelWidth={100}
//       />

//       <CustomButton text="Join" rootStyles={{ borderRadius: ".5rem" }} type="submit" />
//     </StyledForm>
//   );
// };

const VideoPage = () => {
  const classes = useStyles();
  const ctx = useSocketContext();

  // const modalCtx = useModalContext();

  // const handleModal = (Component: any) => () => {
  //   modalCtx?.handleOpen();
  //   modalCtx?.setComponent(<Component handleClose={modalCtx.handleClose} />);
  // };

  return (
    // <SocketContextProvider>
    <WebRTCContextProvider>
      <div className={classes.root}>
        <VideoPlayerOverview />

        {/* {ctx && !ctx.ctxData.callAccepted ? (
    <ButtonsContainer>
      <CustomButton text="Create Meeting" Icon={VideoCallIcon} IconDirection="left" fn={handleModal(NewMeetingForm)} />
      <CustomButton text="Join Meeting" fn={handleModal(JoinMeetingForm)} />
    </ButtonsContainer>
  ) : (
    <ButtonsContainer>
      <CustomButton text="Leave Meeting" color="secondary" Icon={CloseIcon} fn={ctx?.leaveCall} />
    </ButtonsContainer>
  )} */}
      </div>
    </WebRTCContextProvider>

    // </SocketContextProvider>
  );
};

export default VideoPage;
