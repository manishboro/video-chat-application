import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";

import CustomTextField from "../../utility-components/CustomTextField";
import CustomButton from "../../utility-components/CustomButton";

const StyledForm = styled("div")(({ theme }) => ({
  padding: "2rem",
  boxShadow: theme.shadows[3],
  width: "50rem",
  placeSelf: "center",
  borderRadius: ".5rem",
}));

const ButtonsContainer = styled("div")(({ theme }) => ({
  placeSelf: "center",

  "& > button:not(:last-child)": {
    marginRight: "1rem",
  },
}));

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
  },
});

export default function HomePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div></div>
      {/* 
      <StyledForm>
        <CustomTextField id="username" label="Enter display name" value="" labelWidth={100} />
      </StyledForm> */}

      <ButtonsContainer>
        <CustomButton text="New Meeting" />
        <CustomButton text="Join Meeting" variant="outlined" />
      </ButtonsContainer>
    </div>
  );
}
