import React from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@mui/styles";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import CustomTextField from "../../utility-components/CustomTextField";
import CustomButton from "../../utility-components/CustomButton";
import { setItemToStorage } from "../../utils/localStorage";
import { StyledForm } from "./styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",

    "& button:not(:last-child)": {
      marginRight: "1rem",
    },
  },
});

export default function RenderHome() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <CustomButton text="Create Meeting" Icon={VideoCallIcon} IconDirection="left" />
      <CustomButton text="Join Meeting" /> */}
    </div>
  );
}
