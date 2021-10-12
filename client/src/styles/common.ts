import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

let IconStyles = { fontSize: "30px", color: "white" };

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
