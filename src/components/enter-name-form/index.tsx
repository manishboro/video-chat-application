import React from "react";

import { Box } from "@mui/system";

import CustomTextField from "../../utility-components/CustomTextField";

let url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/"
    : "https://kushala-video-consultation.netlify.app/";

export default function EnterNameForm() {
  const [phoneNumber, setPhoneNumber] = React.useState("");

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
        type="number"
        value={phoneNumber}
        handleChange={(e) => setPhoneNumber(e.target.value)}
      />

      <Box
        component="button"
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
        {phoneNumber.length === 10 ? (
          <a
            href={`${url}?p=${phoneNumber}&mode=auto&type=c`}
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
        ) : (
          <div
            style={{
              padding: ".5rem 1.5rem",
              display: "block",
              color: "white",
            }}
          >
            Call
          </div>
        )}
      </Box>
    </Box>
  );
}
