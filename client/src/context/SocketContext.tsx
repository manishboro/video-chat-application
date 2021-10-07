import React from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

import { getItemFromStorage } from "../utils/localStorage";
import { useAlertContext } from "./AlertContext";

export interface AppContextInterface {
  ctxData: CtxDataInterface;
  videoPlayer: any;
  userVideo: any;
  myVideo: any;
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
  displayName: string;
  me: string;
}

type CtxDataCall = { isReceivingCall: boolean; from: string; displayName: string; signal: any } | undefined;
type SetDataValue = boolean | string | MediaStream | CtxDataCall;

const AppCtx = React.createContext<AppContextInterface | null>(null);

export const useSocketContext = () => React.useContext(AppCtx);

const socket = io("http://localhost:3001");

const SocketContextProvider: React.FC = ({ children }) => {
  const alert = useAlertContext();

  const [ctxData, setCtxData] = React.useState<CtxDataInterface>({
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    call: undefined,
    video: true,
    audio: true,
    displayName: "",
    me: "",
  });

  const handleSetData = (key: string, value: SetDataValue) => setCtxData((prev) => ({ ...prev, [key]: value }));

  const videoPlayer = React.useRef<any>(null);
  const myVideo = React.useRef<any>(null);
  const userVideo = React.useRef<any>(null);
  const connectionRef = React.useRef<any>(null);

  React.useEffect(() => {
    let stream = null;

    const getMedia = async () => {
      if (!videoPlayer.current) return; // Check whether video player is rendered or not

      try {
        // Returns us an ID as soon as the connection is established
        socket.on("me", (id) => {
          console.log("me", id);
          setCtxData((prev) => ({ ...prev, me: id }));
        });

        socket.on("callUser", ({ from, displayName: callerName, signal }) => {
          console.log(from, callerName, signal);
          handleSetData("call", { isReceivingCall: true, from, displayName: callerName, signal });
        });

        if (getItemFromStorage("displayName")) handleSetData("displayName", getItemFromStorage("displayName") ?? "");

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

    const peer = new Peer({ initiator: false, trickle: false, stream: ctxData.stream });

    peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: ctxData.call?.from }));
    peer.on("stream", (currentStream) => {
      console.log(currentStream);
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(ctxData.call?.signal);

    connectionRef.current = peer;
  };

  // To call other user
  const callUser = (id: string) => {
    console.log(id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: ctxData.stream,
    });

    peer.on("signal", (data) =>
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: ctxData.me,
        displayName: ctxData.displayName,
      })
    );

    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

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

  const appContext: AppContextInterface = { ctxData, videoPlayer, userVideo, myVideo, handleSetData, answerCall, callUser, leaveCall };
  return <AppCtx.Provider value={appContext}>{children}</AppCtx.Provider>;
};

export default SocketContextProvider;
