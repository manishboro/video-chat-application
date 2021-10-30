import React from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useUserContext } from "./UserContext";

const socket = io(process.env.REACT_APP_IO_URI ?? "/");

let configuration = {
  iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] }],
  iceCandidatePoolSize: 10,
};

let constraints = { audio: true, video: true };

const pc = new RTCPeerConnection(configuration);

const WebRTCCtx = React.createContext<any>(null);
export const useWebRtcCtx = () => React.useContext(WebRTCCtx);

// pc.onicecandidate = (e) => console.log("New ice candidate!");

const WebRTCContextProvider: React.FC = ({ children }) => {
  let params = useParams<{ roomId: string }>();
  const userCtx = useUserContext();

  // Create refs to store the local and remote stream
  const localStreamRef = React.useRef<any>(null);
  const remoteStreamRef = React.useRef<any>(null);

  // States
  const [mySocketId, setMySocketId] = React.useState("");
  const [myRoom, setMyRoom] = React.useState<any>([]);

  const [callerDetails, setCallerDetails] = React.useState<any>();
  const [receiverDetails, setReceiverDetails] = React.useState<any>();
  const [iceCandidates, setIceCandidates] = React.useState<any>();

  const [isReceivingCall, setIsReceivingCall] = React.useState(false);
  const [isCallAccepted, setIsCallAccepted] = React.useState(false);

  const [localUserDetails, setLocalUserDetails] = React.useState<any>();
  const [remoteUserDetails, setRemoteUserDetails] = React.useState<any>();

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
        localStreamRef.current.srcObject = localStream;
        remoteStreamRef.current.srcObject = remoteStream;
      } catch (err: any) {
        alert(err.message);
      }
    };

    getUserMedia();

    /* Socket Events and Emitters */
    //Gets my socket id from the server
    socket.on("mySocketId", (id) => setMySocketId(id));

    // Send roomId to server
    socket.emit("join-room", params.roomId);

    // Get all socket Ids present in a room. The event is emitted when somebody joins a room.
    socket.on("user-connected", (data) => setMyRoom(data.myRoom));

    // Get callerDetails
    socket.on("listen-for-call", ({ sdpOffer, callerId, displayName }) => {
      // Set received offer using setRemoteDescription()
      setCallerDetails({ callerId, displayName, sdpOffer });
      setIsReceivingCall(true);
    });

    // Set ICE candidate
    socket.on("add-ice-candidate", (data) => {
      if (data.iceCandidate) {
        console.log("iceCandidate", data.iceCandidate, data.to);
        pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
      }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    pc.addEventListener("connectionstatechange", (event) => {
      if (pc.connectionState === "connected") {
        console.log("peers connected");
      }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    pc.addEventListener("icegatheringstatechange ", (event) => {
      console.log("icegatheringstatechange", event);
    });
  }, []);

  const makeCall = async (userToCallSocketId: string) => {
    pc.onicecandidate = (event) => {
      console.log("caller", event.candidate);

      if (event.candidate) {
        socket.emit("new-ice-candidate", {
          to: userToCallSocketId,
          iceCandidate: event.candidate,
        });
      } else {
        console.log("All ICE candidates from caller side has been sent!");
      }
    };

    // Crate offer (SDP) and set it as localDescription
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send my offer (SDP) to the user with whom i want to have a call
    socket.emit("call-user", {
      userToCall: userToCallSocketId,
      callerId: mySocketId,
      sdpOffer: offer,
      displayName: userCtx?.displayName,
    });

    // Opens a new event "call-accepted". It is emitted when our call is accepted
    socket.on("call-accepted", ({ sdpAnswer, receiverId, displayName }) => {
      // Set the received answer using setRemoteDescription()
      if (sdpAnswer) {
        console.log("sdp answer received", sdpAnswer);
        pc.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
      }

      setReceiverDetails({ receiverId, displayName, sdpAnswer });
    });

    // socket.on("add-ice-candidate", (data) => {
    //   if (data.iceCandidate) {
    //     console.log("caller", "adding ice candidate");
    //     pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
    //   }
    // });
  };

  const answerCall = async () => {
    setIsCallAccepted(true);

    pc.onicecandidate = (event) => {
      console.log("receiver", event.candidate);

      if (event.candidate) {
        socket.emit("new-ice-candidate", {
          to: callerDetails.callerId,
          iceCandidate: event.candidate,
        });
      } else {
        console.log("All ICE candidates from receiver side has been sent!");
      }
    };

    if (callerDetails.sdpOffer) {
      console.log("sdp offer received", callerDetails.sdpOffer);

      pc.setRemoteDescription(new RTCSessionDescription(callerDetails.sdpOffer));
    }

    // Create answer (SDP) and set it as localDescription
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Send my answer (SDP) to the user who is calling us
    socket.emit("answer-call", {
      sdpAnswer: answer,
      receiverId: mySocketId,
      displayName: userCtx?.displayName,
      caller: callerDetails.callerId,
    });

    // socket.on("add-ice-candidate", (data) => {
    //   console.log("receiver", "adding ice candidate");
    //   if (data.iceCandidate) pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
    // });
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
