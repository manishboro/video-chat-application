import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

import { StyledMicIcon, StyledMicOffIcon, StyledVideocamIcon, StyledVideocamOffIcon } from "../../../styles/common";
import { useSocketContext } from "../../../context/SocketContext";

type VideoRef = React.LegacyRef<HTMLVideoElement> | undefined;

const useStyles = makeStyles({
  root: { position: "relative" },

  displayName: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0, 0, 0, .5)",
    color: "white",
    padding: "5px",
    fontFamily: "Montserrat",
  },

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

const StyledVideoPlayer = styled("video")(({ theme }) => ({
  transform: "rotateY(180deg)",
  margin: "auto",
}));

interface VideoPlayerProps {
  videoRef: VideoRef;
  height?: string;
  width?: string;
  muted: boolean;
  displayName: string | undefined;
  audioBool: boolean | undefined;
  videoBool: boolean | undefined;
  updateMic?: () => void;
  updateVideo?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  muted,
  videoRef,
  audioBool,
  videoBool,
  height,
  width,
  displayName,
  updateMic,
  updateVideo,
}) => {
  const classes = useStyles();

  // console.log("videoRef", videoRef);

  return true ? (
    <div className={classes.root}>
      <StyledVideoPlayer width={width ?? "100%"} height={height ?? "auto"} playsInline muted={muted} ref={videoRef} autoPlay />

      {displayName && <div className={classes.displayName}>{displayName}</div>}

      <ul className={classes.listsContainer}>
        <li>
          <IconButton className={classes.iconButton} onClick={() => (updateMic ? updateMic() : null)}>
            {audioBool ? <StyledMicIcon /> : <StyledMicOffIcon />}
          </IconButton>
        </li>

        <li>
          <IconButton className={classes.iconButton} onClick={() => (updateVideo ? updateVideo() : null)}>
            {videoBool ? <StyledVideocamIcon /> : <StyledVideocamOffIcon />}
          </IconButton>
        </li>
      </ul>
    </div>
  ) : null;
};

export default VideoPlayer;
