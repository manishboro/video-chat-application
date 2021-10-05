import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

export const FooterRoot = styled("footer")(({ theme }) => ({
  height: "8rem",
  backgroundColor: "484848",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const ListContainer = styled("ul")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  listStyle: "none",

  "& li:not(:last-child)": { marginRight: ".5rem" },
}));

export const StyledMicIcon = styled(MicIcon)(({ theme }) => ({
  fontSize: "3rem",
  color: "white",
}));

export const StyledVideocamIcon = styled(VideocamIcon)(({ theme }) => ({
  fontSize: "3rem",
  color: "white",
}));
