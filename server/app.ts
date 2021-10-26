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
  // Emits the socket ID of the connected user
  socket.emit("me", socket.id);

  socket.on("join-room", (roomName) => {
    // Join a room
    socket.join(roomName);

    // Get all sockets connected to different rooms
    const allRooms = io.of(`/`).adapter.rooms;

    // Get sockets connected to a particular room
    let myRoom = allRooms.get(roomName);

    // Converting myRoom Set to an Array
    let arrMyRoom = Array.from(myRoom ?? []);

    console.log(myRoom, arrMyRoom);

    // Sending room details to all the connected client even to myself
    io.to(roomName).emit("user-connected", { roomId: roomName, myRoom: Array.from(myRoom ?? []) });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus }));

  socket.on("callUser", ({ userToCall, signalData, from, displayName }) =>
    io.to(userToCall).emit("callUser2", {
      signal: signalData,
      from,
      displayName,
    })
  );

  socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal));
});
