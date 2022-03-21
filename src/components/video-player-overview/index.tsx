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
  // connectFirestoreEmulator,
} from "firebase/firestore";

import { Box } from "@mui/system";
import { Alert, IconButton, Modal, useMediaQuery } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EditIcon from "@mui/icons-material/Edit";
import CallEndIcon from "@mui/icons-material/CallEnd";

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
// if (window.location.hostname === "localhost") connectFirestoreEmulator(firestore, "localhost", 6001);

// Global State
const pc = new RTCPeerConnection(servers);
let localStream: MediaStream;
let remoteStream: MediaStream;
let docRefListener: Unsubscribe | (() => void) = () => null;
let collectionRefListener: Unsubscribe | (() => void) = () => null;

export default function VideoPlayerOverview() {
  const history = useHistory();
  const userCtx = useUserContext();
  const alert = useAlertContext();
  const modal = useModalContext();

  const query = useQuery();
  let id = query.get("id");
  let type = query.get("type");
  let mode = query.get("mode");
  let phoneNo = query.get("p");

  const matches_620px = useMediaQuery("(max-width: 620px)");

  const [isInfoAlert, setIsInfoAlert] = React.useState(true);

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

  const openCamera = async (auto?: boolean) => {
    try {
      if (!auto) history.push("/"); // Reset URL

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

  const startCall = async (id?: string, auto?: boolean) => {
    try {
      const docRef = doc(firestore, "calls", id ?? nanoid());

      const offerCandidatesCollectionRef = collection(firestore, "calls", docRef.id, "offerCandidates"); // collection ref
      const answerCandidatesCollectionRef = collection(firestore, "calls", docRef.id, "answerCandidates"); // collection ref

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
      await setDoc(docRef, {
        offer,
        callerName: userCtx?.displayName,
        callerAudio: userCtx?.audioOnBool,
        callerVideo: userCtx?.videoOnBool,
      });

      // Attach listeners to look for any changes in the document
      docRefListener = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          setRemoteUserDisplayName(docData.receiverName);
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

      // Set the docId as the roomId for future reference
      setRoomId(docRef.id);

      history.push(`/?type=c&id=${docRef.id}`);

      if (!auto) openModal(RoomIDForm, { roomId: docRef.id });

      alert?.setStateSnackbarContext("Meeting created", "success");

      return docRef.id;
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const answerCall = async (roomId: string, auto?: boolean) => {
    try {
      setRoomId(roomId);

      const offerCandidatesCollectionRef = collection(firestore, "calls", roomId, "offerCandidates"); // collection ref
      const answerCandidatesCollectionRef = collection(firestore, "calls", roomId, "answerCandidates"); // collection ref

      // Get ICE candidates for receiver, save to db
      pc.onicecandidate = async (event) => {
        if (event.candidate) await addDoc(answerCandidatesCollectionRef, event.candidate.toJSON());
      };

      // Save offer description as remote description
      const docRef = doc(firestore, "calls", roomId);
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
        receiverAudio: userCtx?.audioOnBool,
        receiverVideo: userCtx?.videoOnBool,
      });

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

      // Only push if method is manual
      if (!auto) history.push(`/?type=r&id=${roomId}`);
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const updateAudio = async () => {
    try {
      if (myStream) {
        myStream.getAudioTracks()[0].enabled = !userCtx?.audioOnBool;
        userCtx?.setAudioOnBool(!userCtx?.audioOnBool);
        setItemToStorage("audioOnBool", Boolean(!userCtx?.audioOnBool).toString());

        if (roomId && type) {
          let userAudio =
            type === "c" ? { callerAudio: !userCtx?.audioOnBool } : { receiverAudio: !userCtx?.audioOnBool };

          const docRef = doc(firestore, "calls", roomId);
          await updateDoc(docRef, userAudio);
        }
      }
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const updateVideo = async () => {
    try {
      if (myStream) {
        myStream.getVideoTracks()[0].enabled = !userCtx?.videoOnBool;
        userCtx?.setVideoOnBool(!userCtx?.videoOnBool);
        setItemToStorage("videoOnBool", Boolean(!userCtx?.videoOnBool).toString());

        if (roomId && type) {
          let userVideo;

          if (type === "c") userVideo = { callerVideo: !userCtx?.videoOnBool };
          else if (type === "r") userVideo = { receiverVideo: !userCtx?.videoOnBool };
          else return;

          const docRef = doc(firestore, "calls", roomId);
          await updateDoc(docRef, userVideo);
        }
      }
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const disconnectCall = async () => {
    try {
      pc.close();

      setPeersConnected(false);

      // Remove firebase listeners
      docRefListener();
      collectionRefListener();

      history.push("/");
      window.location.reload();
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  const openModal = (Component: React.ElementType, otherProps?: object) => {
    modal?.handleOpen();
    modal?.setComponent(<Component handleClose={modal?.handleClose} alert={alert} {...otherProps} />);
  };

  const sendMeetingLinkInWhatsapp = async (phoneNo: string, roomId: string | undefined) => {
    try {
      alert?.setStateSnackbarContext("Sending meeting link to patient", "info");

      let url = `${process.env.REACT_APP_UI_BASE_URL}?type=r&mode=auto&id=${roomId}`;

      const resPro = await fetch(`${process.env.REACT_APP_API_BASE_URL}message/whatsapp/${phoneNo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ message: `Please join the meeting using the link ${url}` }),
        body: JSON.stringify({
          message: `Hello _ , _ has started the video consultation. Please click on the link and do join video consultation immediately ${url}.`,
        }),
      });

      const res = await resPro.json();

      if (res.data.details === "success") alert?.setStateSnackbarContext("Meeting link sent", "success");
    } catch (err: any) {
      alert?.setStateSnackbarContext(err.message, "warning");
    }
  };

  React.useEffect(() => {
    const handleFunc = async () => {
      // Receive call automatically using meeting join URL
      if (type === "c" && mode === "auto" && phoneNo) {
        alert?.setStateSnackbarContext(`Creating meeting`, "info");
        await openCamera(true);
        const roomId = await startCall(undefined, true);
        sendMeetingLinkInWhatsapp(phoneNo, roomId);
      }

      // Receive call automatically using meeting join URL
      if (type === "r" && id && mode === "auto") {
        alert?.setStateSnackbarContext(`Joining meeting`, "info");
        await openCamera(true);
        answerCall(id, true);
      }

      // Listen for connectionstatechange on the local RTCPeerConnection
      pc.addEventListener("connectionstatechange", async () => {
        console.log(pc.connectionState);

        if (pc.connectionState === "connected") {
          console.log("Peers connected!");
          setPeersConnected(true);

          if (id) {
            const docRef = doc(firestore, "calls", id);
            await updateDoc(docRef, { isPeersConnected: true });
          }

          alert?.setStateSnackbarContext(`Connection established`, "success");
        }

        if (["disconnected", "closed", "failed"].includes(pc.connectionState)) {
          alert?.setStateSnackbarContext(`Call ${pc.connectionState}`, "info");

          setPeersConnected(false);

          pc.close();

          // Remove firebase listeners
          docRefListener();
          collectionRefListener();

          history.push("/");
          window.location.reload();
        }
      });
    };

    handleFunc();

    // Clean up all listeners when component is unmounted
    return () => {
      docRefListener();
      collectionRefListener();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Set the audio and video tracks to appropriate states using the values stored on localstorage
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = userCtx?.audioOnBool === undefined ? false : userCtx?.audioOnBool;
      // myStream.getVideoTracks()[0].enabled = userCtx?.videoOnBool === undefined ? false : userCtx?.videoOnBool;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream]);

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100vw",
          backgroundColor: "#484848",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {isPeersConnected ? (
          isInfoAlert && (
            <Alert
              severity="info"
              onClose={() => setIsInfoAlert(false)}
              sx={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20000,
              }}
            >
              Please do not refresh the page while on call to avoid disconnection
            </Alert>
          )
        ) : matches_620px || roomId ? null : (
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
            height: `calc(100% - ${matches_620px ? "60px" : isPeersConnected || roomId ? "80px" : "180px"})`,
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "& > div": { margin: ".5rem" },

            "@media (max-width: 960px)": { flexDirection: "column-reverse" },
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
            height: "80px",
            width: "100%",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "@media (max-width:620px)": { height: "60px" },
          }}
        >
          {isCameraOn && (
            <>
              <MicAndVideo
                audioBool={userCtx?.audioOnBool}
                videoBool={userCtx?.videoOnBool}
                updateMic={updateAudio}
                updateVideo={updateVideo}
              />

              {isPeersConnected && (
                <IconButton
                  sx={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    border: "1px solid white",

                    "&:hover": { backgroundColor: "red" },
                  }}
                  onClick={disconnectCall}
                >
                  <CallEndIcon sx={{ fontSize: "25px", color: "white" }} />
                </IconButton>
              )}
            </>
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
              show: isPeersConnected || roomId ? false : true,
              onClick: startCall,
            },
            {
              name: "Join Meeting",
              button: true,
              Icon: KeyboardIcon,
              show: isPeersConnected || roomId ? false : true,
              onClick: () => openModal(JoinMeetingForm, { answerCall }),
            },
            {
              name: "Edit display name",
              button: true,
              Icon: EditIcon,
              show: true,
              onClick: () =>
                openModal(EnterNameForm, {
                  setTrigger: userCtx?.setTrigger,
                  showAlert: false,
                  message: "Display name changed successfully",
                  roomId: id,
                  updateDB: async (roomId: string, name: string) => {
                    const docRef = doc(firestore, "calls", roomId);

                    let displayName;

                    if (type === "c") displayName = { callerName: name };
                    else if (type === "r") displayName = { receiverName: name };
                    else return;

                    await updateDoc(docRef, displayName);
                  },
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
