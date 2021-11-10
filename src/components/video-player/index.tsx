import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"; // Not supported in React v18
import { IconButton } from "@mui/material";

import { StyledMicIcon, StyledMicOffIcon, StyledVideocamIcon, StyledVideocamOffIcon } from "../../styles/common";

type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;

const useStyles = makeStyles({
  root: {
    position: "relative",
    border: "1px solid white",
    width: "45vw",
    height: "30vw",
    overflow: "hidden",
  },

  displayName: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0, 0, 0, .5)",
    color: "white",
    padding: "5px",
    fontFamily: "Montserrat",
  },

  listsContainerRoot: {
    position: "absolute",
    bottom: "1rem",
    zIndex: 1,
    left: "50%",
    transform: "translateX(-50%)",
  },

  listsContainer: {
    listStyle: "none",
    display: "flex",

    "& > li:not(:last-child)": { marginRight: "10px" },
  },

  iconButton: {
    border: "1px solid white",

    "&:hover": { backgroundColor: "rgba(0, 0, 0, .7)" },
  },
});

const StyledVideoPlayer = styled("video")(({ theme }) => ({
  transform: "rotateY(180deg)",
  objectFit: "cover",
  objectPosition: "center",
  width: "100%",
  height: "100%",
  background: "#6D6D6D",
}));

interface VideoPlayerProps {
  videoRef: VideoRef;
  displayName: string | undefined;
  muted: boolean;
  isVisible?: boolean;
  showMicAndVideo?: boolean;
  disableMicAndVideoBtn?: boolean;
  audioBool?: boolean | undefined;
  videoBool?: boolean | undefined;
  updateMic?: () => void;
  updateVideo?: () => void;
}

interface MicAndVideoProps {
  audioBool: boolean | undefined;
  videoBool: boolean | undefined;
  disableMicAndVideoBtn?: boolean;
  updateMic?: () => void;
  updateVideo?: () => void;
}

export const MicAndVideo = ({
  updateMic,
  updateVideo,
  disableMicAndVideoBtn,
  audioBool = false,
  videoBool = false,
}: MicAndVideoProps) => {
  const classes = useStyles();

  return (
    <ul className={classes.listsContainer}>
      <li>
        <IconButton
          className={classes.iconButton}
          disabled={disableMicAndVideoBtn}
          style={{ backgroundColor: audioBool || disableMicAndVideoBtn ? "rgba(0, 0, 0, .7)" : "red" }}
          onClick={() => (updateMic ? updateMic() : null)}
        >
          {audioBool ? <StyledMicIcon /> : <StyledMicOffIcon />}
        </IconButton>
      </li>

      <li>
        <IconButton
          className={classes.iconButton}
          disabled={disableMicAndVideoBtn}
          style={{ backgroundColor: videoBool || disableMicAndVideoBtn ? "rgba(0, 0, 0, .7)" : "red" }}
          onClick={() => (updateVideo ? updateVideo() : null)}
        >
          {videoBool ? <StyledVideocamIcon /> : <StyledVideocamOffIcon />}
        </IconButton>
      </li>
    </ul>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  muted,
  videoRef,
  audioBool,
  videoBool,
  showMicAndVideo,
  disableMicAndVideoBtn = false,
  isVisible = true,
  displayName,
  updateMic,
  updateVideo,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{ display: isVisible ? "block" : "none" }}>
      <StyledVideoPlayer playsInline muted={muted} ref={videoRef} autoPlay />

      {displayName && <div className={classes.displayName}>{displayName}</div>}

      {showMicAndVideo && (
        <div className={classes.listsContainerRoot}>
          <MicAndVideo
            audioBool={audioBool}
            videoBool={videoBool}
            disableMicAndVideoBtn={disableMicAndVideoBtn}
            updateMic={updateMic}
            updateVideo={updateVideo}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
