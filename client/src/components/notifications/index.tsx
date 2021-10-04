import Button from "@mui/material/Button";

import { useSocketContext } from "../../context/SocketContext";

const Notifications = () => {
  const ctx = useSocketContext();

  return ctx ? (
    ctx.ctxData.call.isReceivingCall && !ctx.ctxData.callAccepted ? (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <h1>{ctx.ctxData.call.name} is calling:</h1>
        <Button variant="contained" color="primary" onClick={ctx.answerCall}>
          Answer
        </Button>
      </div>
    ) : null
  ) : null;
};

export default Notifications;
