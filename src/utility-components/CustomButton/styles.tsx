import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    fontSize: "16px",
    fontFamily: "Montserrat",
    position: "relative",
    width: "max-content",
    padding: 0,
    height: "max-content",
    textTransform: "none",
    outline: "none",

    "& a": { color: "white", textDecoration: "none" },
  },

  button: {
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "0 1.5rem",
  },

  icon: {
    fontSize: "25px",
    marginLeft: "1rem",
  },
});
