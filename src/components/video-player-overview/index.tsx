import React from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  getDoc,
  updateDoc,
  Unsubscribe,
} from "firebase/firestore";

import { Box } from "@mui/system";
import { Alert, Modal, useMediaQuery } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EditIcon from "@mui/icons-material/Edit";

import CustomButton from "../../utility-components/CustomButton";
import VideoPlayer, { MicAndVideo } from "../video-player";
import JoinMeetingForm from "../join-meeting-form";
import RoomIDForm from "../room-id-form";
import useQuery from "../../hooks/useQuery";
import Sidebar from "../sidebar";
import EnterNameForm from "../enter-name-form";
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
let docRefListener: Unsubscribe | (() => void) = () => console.log("removing doc listener");
let collectionRefListener: Unsubscribe | (() => void) = () => console.log("removing collection listener");

export default function VideoPlayerOverview() {
  const history = useHistory();
  const userCtx = useUserContext();
  const alert = useAlertContext();
  const modal = useModalContext();
  const query = useQuery();

  const matches_620px = useMediaQuery("(max-width: 620px)");

  const [roomId, setRoomId] = React.useState("");
  const [remoteUserDisplayName, setRemoteUserDisplayName] = React.useState("");
  const [myStream, setMyStream] = React.useState<MediaStream | null>(null);
  const [remoteAudio, setRemoteAudio] = React.useState<boolean | undefined>(undefined);
  const [remoteVideo, setRemoteVideo] = React.useState<boolean | undefined>(undefined);
  const [isCameraOn, setIsCameraOn] = React.useState(false);
  const [isPeersConnected, setPeersConnected] = React.useState(false); // This state has to be common across local and remote connection

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
      await setDoc(newDocRef, {
        offer,
        callerName: userCtx?.displayName,
        callerAudio: userCtx?.audioOnBool,
        callerVideo: userCtx?.videoOnBool,
      });

      // Attach listeners to look for any changes in the document
      docRefListener = onSnapshot(newDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          setRemoteUserDisplayName(docData.receiverName);
          // setIsCallAccepted(docData.isCallAccepted ?? false);
          setRemoteAudio(docData.receiverAudio);
          setRemoteVideo(docData.receiverVideo);

          // Save answer description as remote description
          if (!pc.currentRemoteDescription && docData?.answer) {
            const answerDescription = new RTCSessionDescription(docData.answer);
            pc.setRemoteDescription(answerDescription);
          }
        }
      });

      // Attach listeners to look for any changes in the collection
      collectionRefListener = onSnapshot(answerCandidatesCollectionRef, (collectionSnapshot) => {
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

      history.push("/?type=c");
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    } finally {
      alert?.setStateSnackbarContext("Meeting created", "success");
    }
  };

  const answerCall = async (roomId: string) => {
    try {
      setRoomId(roomId);

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

        const offerDescription = new RTCSessionDescription(docData.offer);
        pc.setRemoteDescription(offerDescription);
      }

      // Create answer
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      const answer = { type: answerDescription.type, sdp: answerDescription.sdp };

      await updateDoc(docRef, {
        answer,
        receiverName: userCtx?.displayName,
        // isCallAccepted: true,
        receiverAudio: userCtx?.audioOnBool,
        receiverVideo: userCtx?.videoOnBool,
      });

      // setIsCallAccepted(true);

      // Attach listeners to look for any changes in the document
      docRefListener = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          setRemoteUserDisplayName(docData.callerName);
          setRemoteAudio(docData.callerAudio);
          setRemoteVideo(docData.callerVideo);
        }
      });

      // Attach listeners to look for any changes in the collection
      collectionRefListener = onSnapshot(offerCandidatesCollectionRef, (collectionSnapshot) => {
        collectionSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

      history.push("/?type=r");
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const updateAudio = async () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !userCtx?.audioOnBool;
      userCtx?.setAudioOnBool(!userCtx?.audioOnBool);
      setItemToStorage("audioOnBool", Boolean(!userCtx?.audioOnBool).toString());

      let type = query.get("type");

      if (roomId && type) {
        let userAudio =
          type === "c" ? { callerAudio: !userCtx?.audioOnBool } : { receiverAudio: !userCtx?.audioOnBool };

        const docRef = doc(firestore, "calls_2", roomId);
        await updateDoc(docRef, userAudio);
      }
    }
  };

  const updateVideo = async () => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !userCtx?.videoOnBool;
      userCtx?.setVideoOnBool(!userCtx?.videoOnBool);
      setItemToStorage("videoOnBool", Boolean(!userCtx?.videoOnBool).toString());

      let type = query.get("type");

      if (roomId && type) {
        let userVideo =
          type === "c" ? { callerVideo: !userCtx?.videoOnBool } : { receiverVideo: !userCtx?.videoOnBool };

        const docRef = doc(firestore, "calls_2", roomId);
        await updateDoc(docRef, userVideo);
      }
    }
  };

  // const disconnectCall = async () => {
  //   pc.close();
  // };

  const openModal = (Component: React.ElementType, otherProps?: object) => {
    modal?.handleOpen();
    modal?.setComponent(<Component handleClose={modal?.handleClose} alert={alert} {...otherProps} />);
  };

  React.useEffect(() => {
    history.push("/");

    // Listen for connectionstatechange on the local RTCPeerConnection
    pc.addEventListener("connectionstatechange", () => {
      if (pc.connectionState === "connected") {
        console.log("Peers connected!");
        setPeersConnected(true);
      }
    });

    if (myStream) {
      myStream.getAudioTracks()[0].enabled = userCtx?.audioOnBool === undefined ? false : userCtx?.audioOnBool;
      myStream.getVideoTracks()[0].enabled = userCtx?.videoOnBool === undefined ? false : userCtx?.videoOnBool;
    }

    return () => {
      docRefListener();
      collectionRefListener();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {matches_620px ? null : isPeersConnected ? null : (
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
        )}

        <Box
          sx={{
            height: `calc(100vh - ${matches_620px ? "100px" : isPeersConnected ? "100px" : "200px"})`,
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "& > div:not(:last-child)": { margin: ".5rem" },

            "@media (max-width: 960px)": {
              flexDirection: "column",
            },
          }}
        >
          <VideoPlayer videoRef={localStreamRef} displayName={userCtx?.displayName} muted={true} />

          <VideoPlayer
            videoRef={remoteStreamRef}
            displayName={remoteUserDisplayName}
            muted={false}
            isVisible={isPeersConnected}
            audioBool={remoteAudio}
            videoBool={remoteVideo}
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
        <Sidebar
          items={[
            {
              name: "Create Meeting",
              button: true,
              Icon: VideoCameraFrontIcon,
              onClick: startCall,
            },
            {
              name: "Join Meeting",
              button: true,
              Icon: KeyboardIcon,
              onClick: () => openModal(JoinMeetingForm, { answerCall }),
            },
            {
              name: "Edit display name",
              button: true,
              Icon: EditIcon,
              onClick: () =>
                openModal(EnterNameForm, {
                  setTrigger: userCtx?.setTrigger,
                  showAlert: false,
                  message: "Display name changed successfully",
                }),
            },
          ]}
        />
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
