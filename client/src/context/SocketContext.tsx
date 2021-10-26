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
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  call: CtxDataCall;
  video: boolean;
  audio: boolean;
  userVideo: boolean | undefined;
  userAudio: boolean | undefined;
  myRoom: [string] | [];
  me: string;
}

type CtxDataCall = { isReceivingCall: boolean; from: string; displayName: string; signal: any } | undefined;
type SetDataValue = boolean | string | MediaStream | CtxDataCall | [string] | [];
type UserConnectedData = { roomId: string; myRoom: [string] | [] };

const AppCtx = React.createContext<AppContextInterface | null>(null);

export const useSocketContext = () => React.useContext(AppCtx);

const socket = io("http://localhost:3001");

const SocketContextProvider: React.FC = ({ children }) => {
  const alert = useAlertContext();
  const userCtx = useUserContext();
  let params = useParams<{ roomId: string }>();

  const [ctxData, setCtxData] = React.useState<CtxDataInterface>({
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    call: undefined,
    video: true,
    audio: true,
    userAudio: true,
    userVideo: true,
    myRoom: [],
    me: "", // my socket id
  });

  const handleSetData = (key: string, value: SetDataValue) => setCtxData((prev) => ({ ...prev, [key]: value }));

  const videoPlayer = React.useRef<any>(null);
  const myVideo = React.useRef<any>(null);
  const userVideo = React.useRef<any>(null);
  const connectionRef = React.useRef<any>(null);

  console.log("call", ctxData.call);

  React.useEffect(() => {
    let stream = null;

    const getMedia = async () => {
      // if (!videoPlayer.current) return; // Check whether video player is rendered or not

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (stream) {
          handleSetData("stream", stream);
          myVideo.current.srcObject = stream;
        }
      } catch (err: any) {
        alert?.handleAlertProps("severity", "warning");
        alert?.handleAlertProps("showAlert", true);
        alert?.handleSnackbar(err.message);
      }
    };

    getMedia();

    // Listen for the me event which will be sent from server
    socket.on("me", (id) => handleSetData("me", id));

    // Emit roomId to server
    socket.emit("join-room", params.roomId);

    // Listen for the user-connected event which will be sent from server
    socket.on("user-connected", (data: UserConnectedData) => {
      handleSetData("myRoom", data.myRoom);
    });

    socket.on("callUser2", ({ from, displayName, signal }) => {
      console.log("callUser2", from, displayName, signal);
      handleSetData("call", { isReceivingCall: true, from, displayName, signal });
    });

    socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
      if (currentMediaStatus !== null || currentMediaStatus !== []) {
        switch (type) {
          case "video":
            handleSetData("userVideo", currentMediaStatus);
            break;

          case "mic":
            handleSetData("userAudio", currentMediaStatus);
            break;

          default:
            handleSetData("userVideo", undefined);
            handleSetData("userAudio", undefined);
            break;
        }
      }
    });

    // eslint-disable-next-line
  }, []);

  // To change video status
  const updateVideo = () => {
    handleSetData("video", !ctxData.video);

    socket.emit("updateMyMedia", {
      type: "video",
      currentMediaStatus: !ctxData.video,
    });

    if (ctxData.stream) ctxData.stream.getVideoTracks()[0].enabled = !ctxData.video;
  };

  // To change mic status
  const updateMic = () => {
    handleSetData("audio", !ctxData.audio);

    socket.emit("updateMyMedia", {
      type: "mic",
      currentMediaStatus: !ctxData.audio,
    });

    if (ctxData.stream) ctxData.stream.getAudioTracks()[0].enabled = !ctxData.audio;
  };

  // To answer a call
  const answerCall = () => {
    handleSetData("callAccepted", true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: ctxData.stream,
    });

    peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: ctxData.call?.from }));

    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    peer.signal(ctxData.call?.signal);

    connectionRef.current = peer;
  };

  // To call other user
  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: ctxData.stream,
    });

    // Establishing a handshake with the person to call
    peer.on("signal", (data) =>
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: ctxData.me,
        displayName: userCtx?.displayName,
      })
    );

    // Gets the incoming data
    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    // Completing the handshake
    socket.on("callAccepted", (signal) => {
      handleSetData("callAccepted", true);
      peer.signal(signal);
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
