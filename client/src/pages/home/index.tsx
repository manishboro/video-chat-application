import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";

import CustomTextField from "../../utility-components/CustomTextField";
import CustomButton from "../../utility-components/CustomButton";
import BackButton from "../../utility-components/BackButton";
import VideoHome from "../../components/video-home";
import { useSocketContext } from "../../context/SocketContext";
import { setItemToStorage } from "../../utils/localStorage";

const StyledRightContainer = styled("div")(({ theme }) => ({
  placeSelf: "center",
  width: "50rem",
}));

const StyledForm = styled("form")(({ theme }) => ({
  padding: "4rem",
  width: "100%",
  placeSelf: "center",
  borderRadius: "3rem",
  position: "relative",
  boxShadow: theme.shadows[3],

  "& > *:not(:last-child)": {
    marginBottom: "1rem",
  },
}));

const ButtonsContainer = styled("div")(({ theme }) => ({
  width: "max-content",
  margin: "auto",

  "& > button:not(:last-child)": {
    marginRight: "1rem",
  },
}));

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    placeItems: "center",
  },
});

export default function HomePage() {
  const classes = useStyles();
  const ctx = useSocketContext();
  let history = useHistory();

  const [step, setStep] = React.useState(1);
  const [idToCall, setIDToCall] = React.useState("");

  const handleStepChange = (input: number) => () => setStep(input);

  const handleJoinMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push("/user-video");
    ctx?.callUser(idToCall);
  };

  return (
    <div className={classes.root}>
      {ctx && <VideoHome data={ctx} />}

      <StyledRightContainer>
        {step === 1 && (
          <ButtonsContainer>
            <CustomButton text="New Meeting" fn={handleStepChange(2)} />
            <CustomButton text="Join Meeting" variant="outlined" fn={handleStepChange(3)} />
          </ButtonsContainer>
        )}

        {step === 2 && (
          <StyledForm
            onSubmit={() => {
              history.push("/admin-video");
              window.location.reload();
            }}
          >
            <BackButton
              fn={handleStepChange(1)}
              rootStyles={{ position: "absolute", top: 0, left: 0, transform: "translate(-40%, -40%)" }}
            />

            <CustomTextField
              id="displayName"
              label="Display Name"
              value={ctx?.ctxData.displayName}
              handleChange={(e) => {
                ctx?.handleSetData("displayName", e.target.value);
                setItemToStorage("displayName", e.target.value ?? "");
              }}
              labelWidth={100}
              required={true}
            />

            <CustomButton
              text="Start"
              rootStyles={{ marginTop: "1rem", borderRadius: ".5rem" }}
              buttonStyles={{ minWidth: "14rem", height: "4rem" }}
              type="submit"
            />
          </StyledForm>
        )}

        {step === 3 && (
          <StyledForm onSubmit={(e) => handleJoinMeeting(e)}>
            <BackButton
              fn={handleStepChange(1)}
              rootStyles={{ position: "absolute", top: 0, left: 0, transform: "translate(-40%, -40%)" }}
            />

            <CustomTextField
              id="displayName"
              label="Display Name"
              value={ctx?.ctxData.displayName}
              labelWidth={100}
              required={true}
              handleChange={(e) => {
                ctx?.handleSetData("displayName", e.target.value);
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

            <CustomButton
              text="Join"
              rootStyles={{ marginTop: "1rem", borderRadius: ".5rem" }}
              buttonStyles={{ minWidth: "10rem", height: "4rem" }}
              type="submit"
            />
          </StyledForm>
        )}
      </StyledRightContainer>
    </div>
  );
}
