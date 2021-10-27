"use strict";
exports.__esModule = true;
exports.httpServer = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var path_1 = require("path");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
exports.httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(exports.httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
app.use((0, cors_1["default"])(), express_1["default"].json());
app.use(express_1["default"].static(path_1["default"].resolve(__dirname, "../client/build")));
app.get("/api", function (req, res) { return res.send("<h1>API server is running!!</h1>"); });
app.get("*", function (req, res) {
    res.sendFile(path_1["default"].resolve(__dirname, "../client/build", "index.html"));
});
io.on("connection", function (socket) {
    // Sends the socket ID of the connected user to the client
    socket.emit("mySocketId", socket.id);
    socket.on("join-room", function (roomName) {
        // Join a room
        socket.join(roomName);
        // Get all sockets connected to different rooms
        var allRooms = io.of("/").adapter.rooms;
        // Get sockets connected to a particular room
        var myRoom = allRooms.get(roomName);
        // Sending room details to all the connected client even to myself
        io.to(roomName).emit("user-connected", { roomId: roomName, myRoom: Array.from(myRoom !== null && myRoom !== void 0 ? myRoom : []) }); // Converting myRoom Set to an Array
    });
    // Send my information to the person whom we are calling
    socket.on("callUser", function (_a) {
        var userToCall = _a.userToCall, signalData = _a.signalData, from = _a.from, displayName = _a.displayName;
        return io.to(userToCall).emit("listenForCall", {
            signal: signalData,
            from: from,
            displayName: displayName
        });
    });
    // socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal));
    socket.on("answerCall", function (_a) {
        var caller = _a.caller, receiverId = _a.receiverId, signalData = _a.signalData, displayName = _a.displayName;
        return io.to(caller).emit("callAccepted", {
            signal: signalData,
            receiverId: receiverId,
            displayName: displayName
        });
    });
    socket.on("updateMyMedia", function (_a) {
        var type = _a.type, currentMediaStatus = _a.currentMediaStatus;
        return socket.broadcast.emit("updateUserMedia", { type: type, currentMediaStatus: currentMediaStatus });
    });
    socket.on("disconnect", function () { return socket.broadcast.emit("callEnded"); });
});
