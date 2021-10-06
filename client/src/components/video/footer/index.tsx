import { CopyToClipboard } from "react-copy-to-clipboard";

import { Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";

import {
  FooterRoot,
  ListContainer,
  StyledMicIcon,
  StyledMicOffIcon,
  StyledContentCopyIcon,
  StyledVideocamIcon,
  StyledVideocamOffIcon,
} from "./styles";
import { useSocketContext } from "../../../context/SocketContext";
import { useAlertContext } from "../../../context/AlertContext";

const useStyles = makeStyles({
  tooltip: { fontSize: "1.6rem" },
});

export default function Footer() {
  const classes = useStyles();
  const ctx = useSocketContext();
  const alert = useAlertContext();

  return (
    ctx?.videoPlayer.current && (
      <FooterRoot>
        <ListContainer>
          <li>
            <IconButton onClick={() => ctx.handleSetData("audio", !ctx.ctxData.audio)}>
              {ctx.ctxData.audio ? <StyledMicIcon /> : <StyledMicOffIcon />}
            </IconButton>
          </li>

          <li>
            <IconButton onClick={() => ctx.handleSetData("video", !ctx.ctxData.video)}>
              {ctx.ctxData.video ? <StyledVideocamIcon /> : <StyledVideocamOffIcon />}
            </IconButton>
          </li>

          <li>
            <CopyToClipboard text={ctx.ctxData.me}>
              <IconButton
                onClick={() => {
                  alert?.handleAlertProps("severity", "success");
                  alert?.handleAlertProps("showAlert", true);
                  alert?.handleSnackbar("User ID copied!!");
                }}
              >
                <Tooltip title="Copy Room ID" classes={{ tooltip: classes.tooltip }}>
                  <StyledContentCopyIcon />
                </Tooltip>
              </IconButton>
            </CopyToClipboard>
          </li>
        </ListContainer>
      </FooterRoot>
    )
  );
}
