import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { makeStyles } from "@mui/styles"; // deprecated
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Assignment from "@mui/icons-material/Assignment";
import Phone from "@mui/icons-material/Phone";
import PhoneDisabled from "@mui/icons-material/PhoneDisabled";

import { useSocketContext } from "../../context/SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },

  gridContainer: {
    width: "100%",

    // [theme.breakpoints.down("xs")]: {
    //   flexDirection: "column",
    // },
  },

  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,

    // [theme.breakpoints.down("xs")]: {
    //   width: "80%",
    // },
  },

  margin: { marginTop: 20 },

  padding: { padding: 20 },

  paper: {
    padding: "10px 20px",
    border: "2px solid black",
  },
}));

const Sidebar: React.FC = ({ children }) => {
  const classes = useStyles();
  const ctx = useSocketContext();
  const [idToCall, setIdToCall] = useState("");

  return ctx ? (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Account Info
              </Typography>

              <TextField
                label="Name"
                value={ctx.ctxData.name}
                onChange={(e) => ctx.setCtxData((prev) => ({ ...prev, name: e.target.value }))}
                fullWidth
              />

              <CopyToClipboard text={ctx.ctxData.me}>
                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>

            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>

              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />

              {ctx.ctxData.callAccepted && !ctx.ctxData.callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={ctx.leaveCall}
                  className={classes.margin}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => ctx.callUser(idToCall)}
                  className={classes.margin}
                >
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  ) : null;
};

export default Sidebar;
