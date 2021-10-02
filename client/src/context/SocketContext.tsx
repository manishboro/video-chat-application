import React from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

interface AppContextInterface {
  ctxData: CtxDataInterface;
  setCtxData: React.Dispatch<React.SetStateAction<CtxDataInterface>>;
  answerCall(): void;
  callUser(id: string): void;
  leaveCall(): void;
  userVideo: any;
  myVideo: any;
}

interface CtxDataInterface {
  callAccepted: boolean;
  callEnded: boolean;
  stream: any;
  name: string;
  call: any;
  me: string;
}

const AppCtx = React.createContext<AppContextInterface | null>(null);

export const useSocketContext = () => React.useContext(AppCtx);

const socket = io("http://localhost:3001");

const ContextProvider: React.FC = ({ children }) => {
  const [ctxData, setCtxData] = React.useState<CtxDataInterface>({
    callAccepted: false,
    callEnded: false,
    stream: {},
    name: "",
    call: {},
    me: "",
  });

  const myVideo = React.useRef<any>(null);
  const userVideo = React.useRef<any>(null);
  const connectionRef = React.useRef<any>(null);

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setCtxData((prev) => ({ ...prev, stream: currentStream }));
      myVideo.current.srcObject = currentStream;
    });

    socket.on("me", (id) => setCtxData((prev) => ({ ...prev, me: id })));

    socket.on("callUser", ({ from, name: callerName, signal }) =>
      setCtxData((prev) => ({
        ...prev,
        call: { isReceivingCall: true, from, name: callerName, signal },
      }))
    );
  }, []);

  const answerCall = () => {
    setCtxData((prev) => ({ ...prev, callAccepted: true }));

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: ctxData.stream,
    });

    peer.on("signal", (data) =>
      socket.emit("answerCall", {
        signal: data,
        to: ctxData.call.from,
      })
    );

    peer.on("stream", (currentStream) => (userVideo.current.srcObject = currentStream));

    peer.signal(ctxData.call.signal);

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
      setCtxData((prev) => ({ ...prev, callAccepted: true }));
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCtxData((prev) => ({ ...prev, callEnded: true }));
    connectionRef.current.destroy();
    window.location.reload();
  };

  const appContext: AppContextInterface = { ctxData, userVideo, myVideo, setCtxData, answerCall, callUser, leaveCall };

  return <AppCtx.Provider value={appContext}>{children}</AppCtx.Provider>;
};

export { ContextProvider };
