import React from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import { useAlertContext } from "./AlertContext";
import { useUserContext } from "./UserContext";

export interface AppContextInterface {
  ctxData: CtxDataInterface;
  videoPlayer: any;
  userVideo: any;
  myVideo: any;
  updateMic(): void;
  updateVideo(): void;
  handleSetData(key: string, value: SetDataValue): void;
  answerCall(): void;
  callUser(id: string): void;
  leaveCall(): void;
}

export interface CtxDataInterface {
  mySocketId: string;
  myStream: MediaStream | undefined;
  callAccepted: boolean;
  callEnded: boolean;
  callerDetails: CtxDataCaller;
  receiverDetails: any;
  myVideoOn: boolean;
  myAudioOn: boolean;
  userVideoOn: boolean | undefined;
  userAudioOn: boolean | undefined;
  myRoom: [string] | [];
}

type CtxDataCaller = { isReceivingCall: boolean; from: string; displayName: string; signal: any } | undefined;
type CtxDataReceiver = { receiverId: string; displayName: string; signal: any } | undefined;
type SetDataValue = boolean | string | MediaStream | CtxDataCaller | CtxDataReceiver | [string] | [];
type UserConnectedData = { roomId: string; myRoom: [string] | [] };
type HandleSetDataKeys =
  | "mySocketId"
  | "myStream"
  | "callAccepted"
  | "callEnded"
  | "callerDetails"
  | "receiverDetails"
  | "myVideoOn"
  | "myAudioOn"
  | "userVideoOn"
  | "userAudioOn"
  | "myRoom";

const AppCtx = React.createContext<AppContextInterface | null>(null);

export const useSocketContext = () => React.useContext(AppCtx);

const socket = io("http://localhost:3001");

const SocketContextProvider: React.FC = ({ children }) => {
  const alert = useAlertContext();
  const userCtx = useUserContext();
  let params = useParams<{ roomId: string }>();

  const [ctxData, setCtxData] = React.useState<CtxDataInterface>({
    mySocketId: "",
    myStream: undefined,
    callAccepted: false,
    callEnded: false,
    callerDetails: undefined,
    receiverDetails: undefined,
    myVideoOn: true,
    myAudioOn: true,
    userVideoOn: true,
    userAudioOn: true,
    myRoom: [],
  });

  const handleSetData = (key: HandleSetDataKeys, value: SetDataValue) => setCtxData((prev) => ({ ...prev, [key]: value }));

  const videoPlayer = React.useRef<any>(null);
  const myVideo = React.useRef<any>(null);
  const userVideo = React.useRef<any>(null);
  const connectionRef = React.useRef<any>(null);

  React.useEffect(() => {
    let stream = null;

    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (stream) {
          handleSetData("myStream", stream);
          myVideo.current.srcObject = stream;
        }
      } catch (err: any) {
        alert?.handleAlertProps("severity", "warning");
        alert?.handleAlertProps("showAlert", true);
        alert?.handleSnackbar(err.message);
      }
    };

    getMedia();

    //Gets the socket id from the server
    socket.on("mySocketId", (id) => handleSetData("mySocketId", id));

    // Send roomId to server
    socket.emit("join-room", params.roomId);

    // Get all socket Ids present in a room when somebody joins a room
    socket.on("user-connected", (data: UserConnectedData) => {
      handleSetData("myRoom", data.myRoom);
    });

    socket.on("listenForCall", ({ from, displayName, signal }) => {
      console.log("listenForCall", from, displayName, signal);
      handleSetData("callerDetails", { isReceivingCall: true, from, displayName, signal });
    });

    socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
      if (currentMediaStatus !== null || currentMediaStatus !== []) {
        switch (type) {
          case "video":
            handleSetData("userVideoOn", currentMediaStatus);
            break;

          case "mic":
            handleSetData("userAudioOn", currentMediaStatus);
            break;

          default:
            handleSetData("userVideoOn", undefined);
            handleSetData("userAudioOn", undefined);
            break;
        }
      }
    });

    // eslint-disable-next-line
  }, []);

  // To change video status
  const updateVideo = () => {
    handleSetData("myVideoOn", !ctxData.myVideoOn);

    socket.emit("updateMyMedia", {
      type: "video",
      currentMediaStatus: !ctxData.myVideoOn,
    });

    if (ctxData.myStream) ctxData.myStream.getVideoTracks()[0].enabled = !ctxData.myVideoOn;
  };

  // To change mic status
  const updateMic = () => {
    handleSetData("myAudioOn", !ctxData.myAudioOn);

    socket.emit("updateMyMedia", {
      type: "mic",
      currentMediaStatus: !ctxData.myAudioOn,
    });

    if (ctxData.myStream) ctxData.myStream.getAudioTracks()[0].enabled = !ctxData.myAudioOn;
  };

  // To answer a call
  const answerCall = () => {
    handleSetData("callAccepted", true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: ctxData.myStream,
    });

    peer.on("signal", (data) =>
      socket.emit("answerCall", {
        signalData: data,
        receiverId: ctxData.mySocketId,
        displayName: userCtx?.displayName,
        caller: ctxData.callerDetails?.from,
      })
    );

    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    peer.signal(ctxData.callerDetails?.signal);

    connectionRef.current = peer;
  };

  // To call other user
  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: ctxData.myStream,
    });

    // Establishing a handshake with the person to call
    peer.on("signal", (data) =>
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: ctxData.mySocketId,
        displayName: userCtx?.displayName,
      })
    );

    // Gets the incoming data
    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    // Completing the handshake
    socket.on("callAccepted", (data) => {
      handleSetData("callAccepted", true);

      handleSetData("receiverDetails", {
        receiverId: data.receiverId,
        displayName: data.displayName,
        signal: data.signal,
      });

      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  // To disconnect from a call
  const leaveCall = () => {
    handleSetData("callEnded", true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const appContext: AppContextInterface = {
    ctxData,
    videoPlayer,
    userVideo,
    myVideo,
    updateMic,
    updateVideo,
    handleSetData,
    answerCall,
    callUser,
    leaveCall,
  };

  return <AppCtx.Provider value={appContext}>{children}</AppCtx.Provider>;
};

export default SocketContextProvider;
