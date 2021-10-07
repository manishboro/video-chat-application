import React from "react";

import VideoPlayerOverview from "../../components/video/video-player-overview";
import CustomButton from "../../utility-components/CustomButton";
import CustomTextField from "../../utility-components/CustomTextField";
import { AppContextInterface, useSocketContext } from "../../context/SocketContext";
import { setItemToStorage } from "../../utils/localStorage";
import { ButtonsContainer, StyledForm, useStyles } from "./styles";

const NewMeetingForm: React.FC<{ ctx: AppContextInterface | null }> = ({ ctx }) => (
  <StyledForm onSubmit={() => {}}>
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
);

const JoinMeetingForm: React.FC<{ ctx: AppContextInterface | null }> = ({ ctx }) => {
  const [idToCall, setIDToCall] = React.useState("");

  return (
    <StyledForm onSubmit={(e) => {}}>
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
  );
};

const VideoPage = () => {
  const classes = useStyles();
  const ctx = useSocketContext();
  const [step, setStep] = React.useState(0);

  const handleStepChange = (input: number) => () => setStep(input);

  // const handleJoinMeeting = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   history.push("/user-video");
  //   ctx?.callUser(idToCall);
  // };

  return (
    <div className={classes.root}>
      <VideoPlayerOverview />

      <ButtonsContainer>
        <CustomButton text="New Meeting" fn={handleStepChange(2)} />
        <CustomButton text="Join Meeting" fn={handleStepChange(3)} />
      </ButtonsContainer>

      {step === 1 && <NewMeetingForm ctx={ctx} />}
      {step === 2 && <JoinMeetingForm ctx={ctx} />}

      {/* <StyledRightContainer>
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
      </StyledRightContainer> */}
    </div>
  );
};

export default VideoPage;
