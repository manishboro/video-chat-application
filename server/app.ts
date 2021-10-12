import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
export const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors(), express.json());

app.get("/", (req: Request, res: Response) => res.send("<h1>API server is running!!</h1>"));

io.on("connection", (socket: Socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => socket.broadcast.emit("callEnded"));

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus }));

  socket.on("callUser", ({ userToCall, signalData, from, displayName }) =>
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from,
      displayName,
    })
  );

  socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal));
});
