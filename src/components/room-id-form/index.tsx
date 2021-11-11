import React from "react";

import { Box } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import { copyTextToClipboard } from "../../utils/copyTextToClipboard";
import { SnackbarContextTypes } from "../../context/AlertContext";

interface JoinMeetingFormProps {
  handleClose?: () => void;
  alert?: SnackbarContextTypes | null;
  roomId: string;
}

const RoomIDForm: React.FC<JoinMeetingFormProps> = ({ handleClose, alert, roomId }) => {
  const roomIdRef = React.useRef(null);
  const roomURLRef = React.useRef(null);

  return (
    <Box
      component="form"
      sx={{
        width: "30rem",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: 3,
        padding: "2rem 1.5rem",
        borderRadius: "1rem",
        textAlign: "center",
        backgroundColor: "white",

        "@media (max-width: 530px)": { width: "95vw" },
      }}
    >
      <CustomTextField id="personToCall" label="Room ID" value={roomId} disabled={true} customRef={roomIdRef} />
      <CustomButton
        text="Copy Room ID"
        Icon={ContentCopyIcon}
        rootStyles={{ marginTop: "1rem" }}
        fn={() => {
          copyTextToClipboard(roomIdRef);
          alert?.setStateSnackbarContext("Room ID copied", "success");
        }}
      />

      <Box sx={{ margin: "1rem 0" }}>OR</Box>

      <CustomTextField
        id="personToCall"
        label="Room URL"
        value={window.location.href}
        disabled={true}
        customRef={roomURLRef}
      />
      <CustomButton
        text="Copy URL"
        Icon={ContentCopyIcon}
        rootStyles={{ marginTop: "1rem" }}
        fn={() => {
          copyTextToClipboard(roomURLRef);
          alert?.setStateSnackbarContext("Room URL copied", "success");
        }}
      />
    </Box>
  );
};

export default RoomIDForm;
