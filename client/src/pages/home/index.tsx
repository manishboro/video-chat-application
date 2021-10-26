import React from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

import VideoPlayerOverview from "../../components/video/video-player-overview";
import CustomTextField from "../../utility-components/CustomTextField";
import { useSocketContext } from "../../context/SocketContext";
import { setItemToStorage } from "../../utils/localStorage";
import { ButtonsContainer, StyledForm, useStyles } from "./styles";
import { useModalContext } from "../../context/ModalContext";
import { copyTextToClipboard } from "../../utils/copyTextToClipboard";
import { useAlertContext } from "../../context/AlertContext";

import CustomButton from "../../utility-components/CustomButton";
import { useUserContext } from "../../context/UserContext";

const NewMeetingForm: React.FC<{ handleClose(): void }> = ({ handleClose }) => {
  const alert = useAlertContext();
  const userCtx = useUserContext();
  const history = useHistory();

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        history.push(`/${nanoid()}`);
        handleClose();
        window.location.reload();
      }}
    >
      <CustomTextField
        id="displayName"
        label="Display Name"
        value={userCtx?.displayName}
        labelWidth={100}
        required={true}
        handleChange={(e) => {
          userCtx?.setDisplayName(e.target.value);
          setItemToStorage("displayName", e.target.value ?? "");
        }}
      />

      <CustomButton text="Create" rootStyles={{ borderRadius: ".5rem" }} type="submit" />
    </StyledForm>
  );
};

const JoinMeetingForm: React.FC<{ handleClose(): void }> = ({ handleClose }) => {
  const ctx = useSocketContext();
  const alert = useAlertContext();
  const userCtx = useUserContext();
  const [idToCall, setIDToCall] = React.useState("");

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        ctx?.callUser(idToCall);
        alert?.handleAlertProps("severity", "info");
        alert?.handleAlertProps("showAlert", true);
        alert?.handleSnackbar("Please wait while your call is getting accepted!");
        handleClose();
      }}
    >
      <CustomTextField
        id="displayName"
        label="Display Name"
        value={userCtx?.displayName}
        labelWidth={100}
        required={true}
        handleChange={(e) => {
          userCtx?.setDisplayName(e.target.value);
          setItemToStorage("displayName", e.target.value ?? "");
        }}
      />

      <CustomTextField
        id="personToCall"
        label="Enter Room ID"
        value={idToCall}
        handleChange={(e) => setIDToCall(e.target.value)}
        labelWidth={100}
      />

      <CustomButton text="Join" rootStyles={{ borderRadius: ".5rem" }} type="submit" />
    </StyledForm>
  );
};

export default function Home() {
  const modalCtx = useModalContext();

  const handleModal = (Component: any) => () => {
    modalCtx?.handleOpen();
    modalCtx?.setComponent(<Component handleClose={modalCtx.handleClose} />);
  };

  return (
    <div>
      <CustomButton text="Create Meeting" Icon={VideoCallIcon} IconDirection="left" fn={handleModal(NewMeetingForm)} />
      <CustomButton text="Join Meeting" fn={handleModal(JoinMeetingForm)} />
    </div>
  );
}
