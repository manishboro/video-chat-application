import React from "react";

import { Box } from "@mui/system";

import CustomTextField from "../../utility-components/CustomTextField";
import CustomButton from "../../utility-components/CustomButton";

export default function EnterNameForm() {
  const [displayName, setDisplayName] = React.useState("");

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
        border: "1px solid #dcdcdc",

        "@media (max-width: 530px)": { width: "95vw" },
      }}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      }}
    >
      <CustomTextField
        id="displayName"
        label="Enter phone number"
        value={displayName}
        handleChange={(e) => setDisplayName(e.target.value)}
      />

      {/* <CustomButton
        text="Continue"
        rootStyles={{ marginTop: "1rem" }}
        type="submit"
      /> */}

      <Box
        component="button"
        type="submit"
        disabled
        sx={{
          fontSize: "1.2rem",
          outline: "none",
          borderRadius: ".5rem",
          marginTop: "1rem",
          cursor: "pointer",
          backgroundColor: "#0000FF",
          border: "none",
          boxShadow: 3,
        }}
      >
        <a
          href={`https://kushalam-video-consultation.netlify.app/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: ".5rem 1.5rem",
            display: "block",
            textDecoration: "none",
            color: "white",
          }}
        >
          Call
        </a>
      </Box>
    </Box>
  );
}
