import { styled } from "@mui/material/styles";

type VideoRef = React.LegacyRef<HTMLVideoElement> | undefined;

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
  return <StyledVideoPlayer width={width ?? "100%"} height={height ?? "auto"} playsInline muted ref={videoRef} autoPlay />;
};

export default VideoPlayer;
