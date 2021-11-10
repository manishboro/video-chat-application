import React from "react";
import { nanoid } from "nanoid";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

import { Box } from "@mui/system";
import { Alert, IconButton, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import MenuIcon from "@mui/icons-material/Menu";

import CustomButton from "../../utility-components/CustomButton";
import VideoPlayer, { MicAndVideo } from "../video-player";
import JoinMeetingForm from "../join-meeting-form";
import RoomIDForm from "../room-id-form";
import { firebaseConfig, servers } from "./config";
import { useUserContext } from "../../context/UserContext";
import { useAlertContext } from "../../context/AlertContext";
import { useModalContext } from "../../context/ModalContext";
import { setItemToStorage } from "../../utils/localStorage";

let app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Global State
const pc = new RTCPeerConnection(servers);
let localStream: MediaStream;
let remoteStream: MediaStream;

export default function VideoPlayerOverview() {
  const userCtx = useUserContext();
  const alert = useAlertContext();
  const modal = useModalContext();

  const [roomId, setRoomId] = React.useState("");
  const [remoteUserDisplayName, setRemoteUserDisplayName] = React.useState("");
  const [myStream, setMyStream] = React.useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = React.useState(false);
  const [isCallAccepted, setIsCallAccepted] = React.useState(false); // This state has to be common across local and remote connection

  console.log(roomId);

  // Create refs to store the local and remote stream
  const localStreamRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = React.useRef<HTMLVideoElement | null>(null);

  const openCamera = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      remoteStream = new MediaStream();

      // Push tracks from local stream to peer connection
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      // Pull tracks from remote stream, add to video stream
      pc.ontrack = (event) => event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));

      // Add the Streams to refs so that the video can be displayed
      if (localStreamRef.current && remoteStreamRef.current) {
        setMyStream(localStream);
        localStreamRef.current.srcObject = localStream;
        remoteStreamRef.current.srcObject = remoteStream;
      }

      setIsCameraOn(true);
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const startCall = async () => {
    try {
      const newDocRef = doc(firestore, "calls_2", nanoid());

      const offerCandidatesCollectionRef = collection(firestore, "calls_2", newDocRef.id, "offerCandidates"); // collection ref
      const answerCandidatesCollectionRef = collection(firestore, "calls_2", newDocRef.id, "answerCandidates"); // collection ref

      // Get ICE candidates for caller, save to db
      // **The listener should be added before setting the offer
      pc.onicecandidate = async (event) => {
        if (event.candidate) await addDoc(offerCandidatesCollectionRef, event.candidate.toJSON());
      };

      // Create offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);
      const offer = { sdp: offerDescription.sdp, type: offerDescription.type };

      // Store offer and callerName in the specified document
      await setDoc(newDocRef, { offer, callerName: userCtx?.displayName });

      // Attach listeners to look for any changes in the document
      onSnapshot(newDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          setRemoteUserDisplayName(docData.receiverName);
          setIsCallAccepted(docData.isCallAccepted ?? false);

          // Save answer description as remote description
          if (!pc.currentRemoteDescription && docData?.answer) {
            const answerDescription = new RTCSessionDescription(docData.answer);
            pc.setRemoteDescription(answerDescription);
          }
        }
      });

      // Attach listeners to look for any changes in the collection
      onSnapshot(answerCandidatesCollectionRef, (collectionSnapshot) => {
        collectionSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

      openModal(RoomIDForm, { roomId: newDocRef.id });

      // Set the docId as the roomId for future reference
      setRoomId(newDocRef.id);
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    } finally {
      alert?.setStateSnackbarContext("Meeting created", "success");
    }
  };

  const answerCall = async (roomId: string) => {
    try {
      const offerCandidatesCollectionRef = collection(firestore, "calls_2", roomId, "offerCandidates"); // collection ref
      const answerCandidatesCollectionRef = collection(firestore, "calls_2", roomId, "answerCandidates"); // collection ref

      // Get ICE candidates for receiver, save to db
      pc.onicecandidate = async (event) => {
        if (event.candidate) await addDoc(answerCandidatesCollectionRef, event.candidate.toJSON());
      };

      // Save offer description as remote description
      const docRef = doc(firestore, "calls_2", roomId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        setRemoteUserDisplayName(docData.callerName);
        const offerDescription = new RTCSessionDescription(docData.offer);
        await pc.setRemoteDescription(offerDescription);
      }

      // Create answer
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      const answer = { type: answerDescription.type, sdp: answerDescription.sdp };

      await updateDoc(docRef, { answer, receiverName: userCtx?.displayName, isCallAccepted: true });
      setIsCallAccepted(true);

      // Attach listeners to look for any changes in the collection
      onSnapshot(offerCandidatesCollectionRef, (collectionSnapshot) => {
        collectionSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const updateAudio = () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !userCtx?.audioOnBool;
      userCtx?.setAudioOnBool(!userCtx?.audioOnBool);
      setItemToStorage("audioOnBool", new Boolean(!userCtx?.audioOnBool).toString());
    }
  };

  const updateVideo = () => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !userCtx?.videoOnBool;
      userCtx?.setVideoOnBool(!userCtx?.videoOnBool);
      setItemToStorage("videoOnBool", new Boolean(!userCtx?.videoOnBool).toString());
    }
  };

  const openModal = (Component: React.ElementType, otherProps?: object) => {
    modal?.handleOpen();
    modal?.setComponent(<Component handleClose={modal?.handleClose} alert={alert} {...otherProps} />);
  };

  React.useEffect(() => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = userCtx?.audioOnBool === undefined ? false : userCtx?.audioOnBool;
      myStream.getVideoTracks()[0].enabled = userCtx?.videoOnBool === undefined ? false : userCtx?.videoOnBool;
    }
  }, [myStream]);

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
            height: "100px",
            width: "100%",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isCameraOn && (
            <>
              <CustomButton
                text="Create Meeting"
                Icon={VideoCameraFrontIcon}
                IconDirection="left"
                rootStyles={{ marginRight: "1rem" }}
                fn={() => startCall()}
              />

              <CustomButton
                text="Join Meeting"
                Icon={KeyboardIcon}
                IconDirection="left"
                fn={() => openModal(JoinMeetingForm, { answerCall })}
              />
            </>
          )}
        </Box>

        <Box
          sx={{
            height: "calc(100vh - 200px)",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <VideoPlayer videoRef={localStreamRef} displayName={userCtx?.displayName} muted={true} />

          <VideoPlayer
            videoRef={remoteStreamRef}
            displayName={remoteUserDisplayName}
            muted={false}
            isVisible={isCallAccepted}
            showMicAndVideo={true}
            disableMicAndVideoBtn={true}
          />
        </Box>

        <Box
          sx={{
            height: "100px",
            width: "100%",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isCameraOn && (
            <MicAndVideo
              audioBool={userCtx?.audioOnBool}
              videoBool={userCtx?.videoOnBool}
              updateMic={updateAudio}
              updateVideo={updateVideo}
            />
          )}
        </Box>
      </Box>

      {isCameraOn && (
        <IconButton sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <MenuIcon sx={{ color: "white", fontSize: "2.5rem" }} />
        </IconButton>
      )}

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
