import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, onSnapshot, getDoc } from "firebase/firestore";

import { Box } from "@mui/system";
import { Alert, IconButton, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";

import { firebaseConfig, servers } from "./config";
import CustomButton from "../../utility-components/CustomButton";
import VideoPlayer, { MicAndVideo } from "../video-player";
import { useUserContext } from "../../context/UserContext";

let app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Global State
const pc = new RTCPeerConnection(servers);
let localStream: MediaStream;
let remoteStream: MediaStream;

export default function VideoPlayerOverview() {
  const userCtx = useUserContext();

  const [roomId, setRoomId] = React.useState("");
  const [remoteUserDisplayName, setRemoteUserDisplayName] = React.useState("");
  const [isCameraOn, setIsCameraOn] = React.useState(false);

  // Create refs to store the local and remote stream
  const localStreamRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = React.useRef<HTMLVideoElement | null>(null);

  const openCamera = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));

    // Add the Streams to refs so that the video can be displayed
    if (localStreamRef.current && remoteStreamRef.current) {
      localStreamRef.current.srcObject = localStream;
      remoteStreamRef.current.srcObject = remoteStream;
    }

    setIsCameraOn(true);
  };

  const startCall = async () => {
    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    // Store document in calls_2 collection with a unique docID
    const callsCollectionRef = collection(firestore, "calls_2"); // collection ref
    const newDocRef = await addDoc(callsCollectionRef, { offer, displayName: userCtx?.displayName });

    // Set the docId as the roomId for future reference
    setRoomId(newDocRef.id);

    // Attach listeners to a document
    onSnapshot(newDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        console.log(`In realtime ${JSON.stringify(docData)}`);
      }
    });
  };

  const answerCall = async (roomId: string) => {
    const callsCollectionRef = collection(firestore, "calls_2");
    const docRef = doc(firestore, "calls_2", roomId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      docSnapshot.data();
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#484848",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: "calc(100vh - 100px)",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <VideoPlayer videoRef={localStreamRef} displayName={userCtx?.displayName} muted={true} />
          <VideoPlayer videoRef={remoteStreamRef} displayName={remoteUserDisplayName} muted={false} isVisible={false} />
        </Box>

        <Box
          sx={{
            height: "100px",
            width: "100%",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MicAndVideo audioBool={true} videoBool={true} />

          <Box>
            <CustomButton
              text="Create Meeting"
              fn={startCall}
              Icon={VideoCameraFrontIcon}
              IconDirection="left"
              rootStyles={{ marginRight: "1rem" }}
            />

            <CustomButton text="Join Meeting" Icon={KeyboardIcon} IconDirection="left" fn={startCall} />
          </Box>
        </Box>
      </Box>

      <IconButton sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <MenuIcon sx={{ color: "white", fontSize: "2.5rem" }} />
      </IconButton>

      <Modal open={!isCameraOn} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box>
          <Alert
            severity="info"
            sx={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Please click on the Start Webcam button
          </Alert>
          <CustomButton text="Start Webcam" fn={openCamera} Icon={CameraAltIcon} />
        </Box>
      </Modal>
    </>
  );
}
