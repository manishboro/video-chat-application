import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";

export const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#484848",
    position: "relative",
  },
});

export const ButtonsContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "2rem",
  right: "2rem",

  "& > button:not(:last-child)": {
    marginRight: "1rem",
  },
}));

export const StyledRightContainer = styled("div")(({ theme }) => ({
  placeSelf: "center",
  width: "50rem",
}));

export const StyledForm = styled("form")(({ theme }) => ({
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
