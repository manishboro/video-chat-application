import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    fontSize: "1.7rem",
    fontFamily: "Montserrat",
    position: "relative",
    width: "max-content",
    padding: 0,
    height: "max-content",
    textTransform: "none",

    "& a": { color: "white", textDecoration: "none" },
  },

  button: {
    minWidth: "16rem",
    height: "4.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "0 1.5rem",
  },

  icon: { fontSize: "2.4rem", marginLeft: "1.25rem" },
});
