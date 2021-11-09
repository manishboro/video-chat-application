import React from "react";

import { Box } from "@mui/system";

import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import { AlertContextInterface } from "../../context/AlertContext";

interface JoinMeetingFormProps {
  handleClose(): void;
  answerCall(id: string): void;
  alert: AlertContextInterface | null;
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
      }}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        answerCall(roomId);
        alert?.handleAlertProps("severity", "success");
        alert?.handleAlertProps("showAlert", true);
        alert?.handleSnackbar("Meeting joined");
        handleClose();
      }}
    >
      <CustomTextField id="personToCall" label="Enter room ID" value={roomId} handleChange={(e) => setIDToCall(e.target.value)} />

      <CustomButton text="Join" rootStyles={{ marginTop: "1rem" }} type="submit" />
    </Box>
  );
};

export default JoinMeetingForm;
