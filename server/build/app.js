"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var socket_io_1 = require("socket.io");
dotenv.config({ path: "./config.env" });
if (!process.env.PORT)
    process.exit(1);
console.log("Environment :", process.env.NODE_ENV);
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT, 10);
var server = app.listen(PORT, function () { return console.log("Running on port " + PORT); });
var io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
app.use((0, cors_1.default)(), express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../client/build")));
app.get("/api", function (req, res) { return res.send("<h1>API server is running!!</h1>"); });
app.get("*", function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, "../../client/build", "index.html"));
});
io.on("connection", function (socket) {
    socket.emit("mySocketId", socket.id);
    socket.on("join-room", function (roomName) {
        socket.join(roomName);
        var allRooms = io.of("/").adapter.rooms;
        var myRoom = allRooms.get(roomName);
        io.to(roomName).emit("user-connected", {
            roomId: roomName,
            myRoom: Array.from(myRoom !== null && myRoom !== void 0 ? myRoom : []),
        });
    });
    socket.on("call-user", function (_a) {
        var userToCall = _a.userToCall, sdpOffer = _a.sdpOffer, callerId = _a.callerId, displayName = _a.displayName;
        io.to(userToCall).emit("listen-for-call", {
            sdpOffer: sdpOffer,
            callerId: callerId,
            displayName: displayName,
        });
    });
    socket.on("answer-call", function (_a) {
        var caller = _a.caller, receiverId = _a.receiverId, sdpAnswer = _a.sdpAnswer, displayName = _a.displayName;
        return io.to(caller).emit("call-accepted", {
            sdpAnswer: sdpAnswer,
            receiverId: receiverId,
            displayName: displayName,
        });
    });
    socket.on("new-ice-candidate", function (data) {
        if (data.iceCandidate && data.to)
            io.to(data.to).emit("add-ice-candidate", data);
    });
    socket.on("updateMyMedia", function (_a) {
        var type = _a.type, currentMediaStatus = _a.currentMediaStatus;
        return socket.broadcast.emit("updateUserMedia", { type: type, currentMediaStatus: currentMediaStatus });
    });
    socket.on("disconnect", function () { return socket.broadcast.emit("callEnded"); });
});
