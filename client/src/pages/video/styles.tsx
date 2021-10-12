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
  bottom: "2rem",
  left: "50%",
  transform: "translateX(-50%)",

  "& > button:not(:last-child)": {
    marginRight: "1rem",
  },
}));

export const StyledForm = styled("form")(({ theme }) => ({
  padding: "35px 25px",
  width: "600px",
  placeSelf: "center",
  borderRadius: "10px",
  position: "relative",
  boxShadow: theme.shadows[3],
  backgroundColor: "white",

  "& > *:not(:last-child)": {
    marginBottom: "1rem",
  },
}));
