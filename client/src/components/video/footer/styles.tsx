import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const FooterRoot = styled("footer")(({ theme }) => ({
  height: "8rem",
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

let IconStyles = { fontSize: "3rem", color: "white" };

export const StyledMicIcon = styled(MicIcon)(({ theme }) => ({
  ...IconStyles,
}));

export const StyledMicOffIcon = styled(MicOffIcon)(({ theme }) => ({
  ...IconStyles,
}));

export const StyledVideocamIcon = styled(VideocamIcon)(({ theme }) => ({
  ...IconStyles,
}));

export const StyledVideocamOffIcon = styled(VideocamOffIcon)(({ theme }) => ({
  ...IconStyles,
}));

export const StyledContentCopyIcon = styled(ContentCopyIcon)(({ theme }) => ({
  ...IconStyles,
}));
