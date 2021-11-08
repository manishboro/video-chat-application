import React from "react";

import { Box } from "@mui/system";

import CustomTextField from "../../utility-components/CustomTextField";
import CustomButton from "../../utility-components/CustomButton";
import { Alert } from "@mui/material";
import { setItemToStorage } from "../../utils/localStorage";

type EnterNameFormProps = {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EnterNameForm({ setTrigger }: EnterNameFormProps) {
  const [displayName, setDisplayName] = React.useState("");

  return (
    <>
      <Alert
        severity="info"
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: 3,
        }}
      >
        Please enter a display name
      </Alert>

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
          setItemToStorage("displayName", displayName);
          setTrigger((prev) => !prev);
        }}
      >
        <CustomTextField
          id="displayName"
          label="Enter display name"
          value={displayName}
          handleChange={(e) => setDisplayName(e.target.value)}
        />

        <CustomButton text="Continue" rootStyles={{ marginTop: "1rem" }} type="submit" />
      </Box>
    </>
  );
}
