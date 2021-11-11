import React from "react";

import { Box } from "@mui/system";

import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import { SnackbarContextTypes } from "../../context/AlertContext";

interface JoinMeetingFormProps {
  handleClose(): void;
  answerCall(id: string): void;
  alert: SnackbarContextTypes | null;
}

const JoinMeetingForm: React.FC<JoinMeetingFormProps> = ({ handleClose, answerCall, alert }) => {
  const [roomId, setIDToCall] = React.useState("");

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
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        answerCall(roomId);
        alert?.setStateSnackbarContext("Meeting joined", "success");
        handleClose();
      }}
    >
      <CustomTextField
        id="personToCall"
        label="Enter room ID"
        value={roomId}
        handleChange={(e) => setIDToCall(e.target.value)}
      />

      <CustomButton text="Join" rootStyles={{ marginTop: "1rem" }} type="submit" />
    </Box>
  );
};

export default JoinMeetingForm;
