export const firebaseConfig = {
  apiKey: "AIzaSyA5dbHOLsGqFZdNMgydV5CeKr834SP8Y-M",
  authDomain: "video-chat-app-3cc94.firebaseapp.com",
  projectId: "video-chat-app-3cc94",
  storageBucket: "video-chat-app-3cc94.appspot.com",
  messagingSenderId: "184290888611",
  appId: "1:184290888611:web:3176e9b4e9890c5d912816",
  measurementId: "G-XTQEVW84K3",
};

export const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun.mavoix.co.in:3478"],
    },
    {
      urls: "turn:turn.mavoix.co.in:3478?transport=tcp",
      username: "mavoix",
      credential: "mavoix2020",
    },
  ],
  iceCandidatePoolSize: 10,
};
