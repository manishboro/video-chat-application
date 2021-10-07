import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

import { StyledMicIcon, StyledVideocamIcon } from "../footer/styles";

type VideoRef = React.LegacyRef<HTMLVideoElement> | undefined;

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

const StyledVideoPlayer = styled("video")(({ theme }) => ({
  transform: "rotateY(180deg)",
  margin: "auto",
}));

interface VideoPlayerProps {
  videoRef: VideoRef;
  height?: string;
  width?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, height, width }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <StyledVideoPlayer width={width ?? "100%"} height={height ?? "auto"} playsInline muted ref={videoRef} autoPlay />

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

export default VideoPlayer;
