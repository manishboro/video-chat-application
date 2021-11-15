import React from "react";

import { Box } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";

import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import { SnackbarContextTypes } from "../../context/AlertContext";

interface AuthFormProps {
  alert: SnackbarContextTypes | null;
  setAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({ alert, setAuthorized }: AuthFormProps) => {
  const [authKey, setAuthKey] = React.useState("");

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

        if (authKey === "m@V01X2020") {
          setAuthorized(true);
          alert?.setStateSnackbarContext("Authentication successful", "success");
          return;
        } else {
          setAuthKey("");
          alert?.setStateSnackbarContext("Invalid Authentication Key", "error");
        }
      }}
    >
      <CustomTextField
        id="personToCall"
        label="Enter Authentication Key"
        value={authKey}
        handleChange={(e) => setAuthKey(e.target.value)}
      />

      <CustomButton text="Verify" rootStyles={{ marginTop: "1rem" }} type="submit" Icon={LockIcon} />
    </Box>
  );
};

export default AuthForm;
