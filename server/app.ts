import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

type CallingUserType = { userToCall: string; sdpOffer: RTCSessionDescriptionInit; callerId: string; displayName: string };
type ReceivingUserType = { caller: string; sdpAnswer: RTCSessionDescriptionInit; receiverId: string; displayName: string };
type AddIceCandidateType = { iceCandidate: RTCIceCandidate; to: string; senderType: string };

const app = express();
export const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors(), express.json());

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/api", (req: Request, res: Response) => res.send("<h1>API server is running!!</h1>"));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

io.on("connection", (socket: Socket) => {
  /*****************************************************************/
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
    io.to(roomName).emit("user-connected", {
      roomId: roomName,
      myRoom: Array.from(myRoom ?? []), // Converting myRoom Set to an Array
    });
  });

  // Sending my information to the user whom we are calling
  socket.on("call-user", ({ userToCall, sdpOffer, callerId, displayName }: CallingUserType) => {
    io.to(userToCall).emit("listen-for-call", {
      sdpOffer,
      callerId,
      displayName,
    });
  });

  // Sending back my information to the user who is calling us
  socket.on("answer-call", ({ caller, receiverId, sdpAnswer, displayName }: ReceivingUserType) =>
    io.to(caller).emit("call-accepted", {
      sdpAnswer,
      receiverId,
      displayName,
    })
  );

  // Listens for new ice candidate and if found send to the other user/peer
  socket.on("new-ice-candidate", (data: AddIceCandidateType) => {
    if (data.iceCandidate && data.to) io.to(data.to).emit("add-ice-candidate", data);
  });

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus }));

  socket.on("disconnect", () => socket.broadcast.emit("callEnded"));
});
