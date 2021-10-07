import React from "react";

import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";

import VideoPlayer from "../video/video-player";
import { StyledMicIcon, StyledVideocamIcon } from "../video/footer/styles";
import { AppContextInterface } from "../../context/SocketContext";

const useStyles = makeStyles({
  root: { position: "relative" },

  listsContainer: {
    position: "absolute",
    bottom: "1.5rem",
    zIndex: 1,
    listStyle: "none",
    display: "flex",
    left: "50%",
    transform: "translateX(-50%)",

    "& > li:not(:last-child)": { marginRight: "1rem" },
  },

  iconButton: {
    backgroundColor: "rgba(0, 0, 0, .7)",
    border: "1px solid white",

    "&:hover": { backgroundColor: "rgba(0, 0, 0, .7)" },
  },
});

const VideoHome: React.FC<{ data: AppContextInterface }> = ({ data }) => {
  const classes = useStyles();
  const myVideo = React.useRef<any>(null);

  React.useEffect(() => {
    let stream = null;

    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (stream) myVideo.current.srcObject = stream;
      } catch (err: any) {}
    };

    getMedia();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <VideoPlayer videoRef={myVideo} />
      <ul className={classes.listsContainer}>
        <li>
          <IconButton className={classes.iconButton}>
            <StyledMicIcon />
          </IconButton>
        </li>

        <li>
          <IconButton className={classes.iconButton}>
            <StyledVideocamIcon />
          </IconButton>
        </li>
      </ul>
    </div>
  );
};

export default VideoHome;
