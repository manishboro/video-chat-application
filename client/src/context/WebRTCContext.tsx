import React from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useUserContext } from "./UserContext";

export interface WebRTCContext {
  mySocketId: string;
  myRoom: RoomType;
  isReceivingCall: boolean;
  isCallAccepted: boolean;
  callerDetails: CallerDetailsType;
  receiverDetails: ReceiverDetailsType;
  localStreamRef: any;
  remoteStreamRef: any;
  makeCall(id: string): void;
  answerCall(): void;
}

export type RoomType = string[] | [];
export type IceCandidatesType = RTCIceCandidate[] | [];
export type AddIceCandidateType = { iceCandidate: RTCIceCandidate; to: string; senderType: string };
export type UserConnectedType = { roomId: string; myRoom: RoomType };
export type CallerDetailsType = { callerId: string; displayName: string; sdpOffer: RTCSessionDescriptionInit } | undefined;
export type ReceiverDetailsType = { receiverId: string; displayName: string; sdpAnswer: RTCSessionDescriptionInit } | undefined;

const socket = io(process.env.REACT_APP_IO_URI ?? "/");

let configuration = {
  iceServers: [{ urls: ["stun:stun.mavoix.co.in:3478"] }],
  iceCandidatePoolSize: 10,
};

let constraints = { audio: true, video: true };

const pc = new RTCPeerConnection(configuration);

const WebRTCCtx = React.createContext<WebRTCContext | null>(null);
export const useWebRtcCtx = () => React.useContext(WebRTCCtx);

const WebRTCContextProvider: React.FC = ({ children }) => {
  let params = useParams<{ roomId: string }>();
  const userCtx = useUserContext();

  // States
  const [mySocketId, setMySocketId] = React.useState("");
  const [myRoom, setMyRoom] = React.useState<RoomType>([]);

  const [callerDetails, setCallerDetails] = React.useState<CallerDetailsType>();
  const [receiverDetails, setReceiverDetails] = React.useState<ReceiverDetailsType>();
  const [iceCandidates, setIceCandidates] = React.useState<IceCandidatesType>([]);

  const [isReceivingCall, setIsReceivingCall] = React.useState(false); // Only applicable on the receiver side
  const [isCallAccepted, setIsCallAccepted] = React.useState(false); // This state has to be common across local and remote connection

  // Create refs to store the local and remote stream
  const localStreamRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const getUserMedia = async () => {
      try {
        /* 
          Push tracks from local stream to peer connection.
          Tracks can be added to a RTCPeerConnection before it has connected to a remote peer, so it makes sense to perform this setup as early as possible instead of waiting for the connection to be completed. 
         */
        let localStream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        /* 
          To receive the remote tracks that were added by the other peer, we register a listener on the local RTCPeerConnection listening for the track event. Since playback is done on a MediaStream object, we first create an empty instance that we then populate with the tracks from the remote peer as we receive them.
         */
        let remoteStream = new MediaStream();
        pc.addEventListener("track", async (event) => {
          console.log("receiving track from remoteStream");
          remoteStream.addTrack(event.track);
        });

        /* Add the streams to refs so that the video can be displayed */
        if (localStreamRef.current && remoteStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
          remoteStreamRef.current.srcObject = remoteStream;
        }
      } catch (err: any) {
        alert(err.message);
      }
    };

    getUserMedia();

    /* Socket Events and Emitters */
    // Gets my socket id from the server | Emitter => server
    socket.on("mySocketId", (id: string) => setMySocketId(id));

    // Send roomId to server
    socket.emit("join-room", params.roomId);

    // Get all socket Ids present in a room. The event is emitted when somebody joins a room.
    socket.on("user-connected", (data: UserConnectedType) => setMyRoom(data.myRoom));

    // Get callerDetails
    socket.on("listen-for-call", (data: CallerDetailsType) => {
      // Set received offer using setRemoteDescription()
      if (data?.callerId && data?.displayName && data?.sdpOffer) {
        const { callerId, displayName, sdpOffer } = data;
        setCallerDetails({ callerId, displayName, sdpOffer });
        setIsReceivingCall(true);
      }
    });

    // Set ICE candidate
    socket.on("add-ice-candidate", (data: AddIceCandidateType) => {
      /* 
        Ice candidates are generated after setting localDescription.
        And it has to be set on the other side after setting remoteDescription.
      */
      if (data.iceCandidate) {
        if (data.senderType === "receiver") {
          console.log("add ice-candidate on the caller side");
          // console.log("iceCandidate", "sent by receiver", data.iceCandidate);
          setIceCandidates((prev) => [...prev, data.iceCandidate]);
          return;
          // return pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
        }

        if (data.senderType === "caller" && !pc.remoteDescription) {
          // Store ice-candidates in an array
          console.log("iceCandidate", "sent by caller", data.iceCandidate);
          setIceCandidates((prev) => [...prev, data.iceCandidate]);
          return;
        }
      }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    pc.addEventListener("connectionstatechange", () => {
      if (pc.connectionState === "connected") {
        console.log("Peers connected!!");
      }
    });
  }, []);

  const makeCall = async (userToCallSocketId: string) => {
    // The event should be added before setting localDescription
    pc.onicecandidate = (event) => {
      console.log("caller iceCandidate", event.candidate);

      if (event.candidate) {
        socket.emit("new-ice-candidate", {
          to: userToCallSocketId,
          iceCandidate: event.candidate,
          senderType: "caller",
        });
      } else {
        console.log("All ICE candidates from caller side has been sent!");
      }
    };

    // Crate offer (SDP) and set it as localDescription using setLocalDescription()
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send my offer (SDP) to the user with whom i want to have a call
    socket.emit("call-user", {
      userToCall: userToCallSocketId,
      callerId: mySocketId,
      sdpOffer: offer,
      displayName: userCtx?.displayName,
    });

    // Opens a new event "call-accepted". It is emitted when our call is accepted.
    socket.on("call-accepted", (data: ReceiverDetailsType) => {
      if (data?.receiverId && data?.displayName && data?.sdpAnswer && !pc.currentRemoteDescription) {
        const { receiverId, displayName, sdpAnswer } = data;

        console.log("sdp answer received", sdpAnswer);

        // Set the received answer using setRemoteDescription() using setRemoteDescription()
        pc.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
        setReceiverDetails({ receiverId, displayName, sdpAnswer });

        // When true it removes the call button
        setIsCallAccepted(true);

        let queueIceCandidates = [...iceCandidates];

        queueIceCandidates.forEach((ic) => {
          console.log("add ice-candidate on the caller side");
          pc.addIceCandidate(new RTCIceCandidate(ic));
        });
      }
    });
  };

  const answerCall = async () => {
    // The event should be added before setting localDescription
    pc.onicecandidate = (event) => {
      console.log("receiver iceCandidate", event.candidate);

      if (event.candidate) {
        socket.emit("new-ice-candidate", {
          to: callerDetails?.callerId,
          iceCandidate: event.candidate,
          senderType: "receiver",
        });
      } else {
        console.log("All ICE candidates from receiver side has been sent!");
      }
    };

    // Set remote offer (SDP) and set it as remoteDescription using setRemoteDescription()
    if (callerDetails?.sdpOffer && !pc.currentRemoteDescription) {
      console.log("sdp offer received", callerDetails.sdpOffer);
      pc.setRemoteDescription(new RTCSessionDescription(callerDetails.sdpOffer));

      let queueIceCandidates = [...iceCandidates];

      queueIceCandidates.forEach((ic) => {
        console.log("add ice-candidate on the receiver side");
        pc.addIceCandidate(new RTCIceCandidate(ic));
      });
    }

    // Create answer (SDP) and set it as localDescription using setLocalDescription()
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Send my answer (SDP) to the user who is calling us
    socket.emit("answer-call", {
      sdpAnswer: answer,
      receiverId: mySocketId,
      displayName: userCtx?.displayName,
      caller: callerDetails?.callerId,
    });

    // When true it removes the call button
    setIsCallAccepted(true);
  };

  return (
    <WebRTCCtx.Provider
      value={{
        mySocketId,
        myRoom,
        localStreamRef,
        remoteStreamRef,
        isReceivingCall,
        isCallAccepted,
        callerDetails,
        receiverDetails,
        makeCall,
        answerCall,
      }}
    >
      {children}
    </WebRTCCtx.Provider>
  );
};

export default WebRTCContextProvider;
