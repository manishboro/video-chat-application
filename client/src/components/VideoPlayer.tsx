import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";

import { useSocketContext } from "../context/SocketContext";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },

  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },

  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const classes = useStyles();
  const ctx = useSocketContext();

  return (
    ctx && (
      <Grid container className={classes.gridContainer}>
        {ctx.ctxData.stream && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {ctx.ctxData.name || "Name"}
              </Typography>
              <video playsInline muted ref={ctx.myVideo} autoPlay className={classes.video} />
            </Grid>
          </Paper>
        )}

        {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {ctx.ctxData.call.name || "Name"}
              </Typography>
              <video playsInline ref={ctx.userVideo} autoPlay className={classes.video} />
            </Grid>
          </Paper>
        )}
      </Grid>
    )
  );
};

export default VideoPlayer;
