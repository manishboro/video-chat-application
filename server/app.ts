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

  socket.on("disconnect", () => socket.broadcast.emit("callended"));

  socket.on("calluser", ({ userToCall, signalData, from, name }) => io.to(userToCall).emit("calluser", { signal: signalData, from, name }));

  socket.on("answercall", (data) => io.to(data.to).emit("callaccepted", data.signal));
});
