import React from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

interface AppContextInterface {
  ctxData: CtxDataInterface;
  handleSetData(key: string, value: SetDataValue): void;
  answerCall(): void;
  callUser(id: string): void;
  leaveCall(): void;
  userVideo: any;
  myVideo: any;
}

interface CtxDataInterface {
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  call: CtxDataCall;
  video: boolean;
  audio: boolean;
  name: string;
  me: string;
}

type CtxDataCall = { isReceivingCall: boolean; from: string; name: string; signal: any } | undefined;
type SetDataValue = boolean | string | MediaStream | CtxDataCall;

const AppCtx = React.createContext<AppContextInterface | null>(null);

export const useSocketContext = () => React.useContext(AppCtx);

const socket = io("http://localhost:3001");

const SocketContextProvider: React.FC = ({ children }) => {
  const [ctxData, setCtxData] = React.useState<CtxDataInterface>({
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    call: undefined,
    video: true,
    audio: true,
    name: "",
    me: "",
  });

  const handleSetData = (key: string, value: SetDataValue) => setCtxData((prev) => ({ ...prev, [key]: value }));

  const myVideo = React.useRef<any>(null);
  const userVideo = React.useRef<any>(null);
  const connectionRef = React.useRef<any>(null);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: ctxData.video, audio: ctxData.audio })
      .then((currentStream) => {
        handleSetData("stream", currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((err) => alert(err.message));

    socket.on("me", (id) => setCtxData((prev) => ({ ...prev, me: id })));

    socket.on("callUser", ({ from, name: callerName, signal }) =>
      handleSetData("call", { isReceivingCall: true, from, name: callerName, signal })
    );
  }, []);

  const answerCall = () => {
    handleSetData("callAccepted", true);

    const peer = new Peer({ initiator: false, trickle: false, stream: ctxData.stream });

    peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: ctxData.call?.from }));
    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));
    peer.signal(ctxData.call?.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
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
        name: ctxData.name,
      })
    );

    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    socket.on("callAccepted", (signal) => {
      handleSetData("callAccepted", true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    handleSetData("callEnded", true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const appContext: AppContextInterface = { ctxData, userVideo, myVideo, handleSetData, answerCall, callUser, leaveCall };

  return <AppCtx.Provider value={appContext}>{children}</AppCtx.Provider>;
};

export default SocketContextProvider;
