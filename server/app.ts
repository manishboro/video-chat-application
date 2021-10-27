import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
export const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors(), express.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req: Request, res: Response) => res.send("<h1>API server is running!!</h1>"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

io.on("connection", (socket: Socket) => {
  // Sends the socket ID of the connected user to the client
  socket.emit("mySocketId", socket.id);

  socket.on("join-room", (roomName: string) => {
    // Join a room
    socket.join(roomName);

    // Get all sockets connected to different rooms
    const allRooms = io.of(`/`).adapter.rooms;

    // Get sockets connected to a particular room
    let myRoom = allRooms.get(roomName);

    // Sending room details to all the connected client even to myself
    io.to(roomName).emit("user-connected", { roomId: roomName, myRoom: Array.from(myRoom ?? []) }); // Converting myRoom Set to an Array
  });

  // Send my information to the person whom we are calling
  socket.on("callUser", ({ userToCall, signalData, from, displayName }) =>
    io.to(userToCall).emit("listenForCall", {
      signal: signalData,
      from,
      displayName,
    })
  );

  // socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal));

  socket.on("answerCall", ({ caller, receiverId, signalData, displayName }) =>
    io.to(caller).emit("callAccepted", {
      signal: signalData,
      receiverId,
      displayName,
    })
  );

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus }));

  socket.on("disconnect", () => socket.broadcast.emit("callEnded"));
});
