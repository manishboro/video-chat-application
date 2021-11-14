// Prod credentials
export const firebaseConfig = {
  apiKey: "AIzaSyCoNmlwo5krLmagQ-jbrx-dJRV1lYFpobI",
  authDomain: "video-consultation-2e500.firebaseapp.com",
  projectId: "video-consultation-2e500",
  storageBucket: "video-consultation-2e500.appspot.com",
  messagingSenderId: "2618798322",
  appId: "1:2618798322:web:9223909e621fdbf388e06b",
  measurementId: "G-ECQHMW0XWL",
};

// Dev credentials
// {
//   apiKey: "AIzaSyA5dbHOLsGqFZdNMgydV5CeKr834SP8Y-M",
//   authDomain: "video-chat-app-3cc94.firebaseapp.com",
//   projectId: "video-chat-app-3cc94",
//   storageBucket: "video-chat-app-3cc94.appspot.com",
//   messagingSenderId: "184290888611",
//   appId: "1:184290888611:web:3176e9b4e9890c5d912816",
//   measurementId: "G-XTQEVW84K3",
// }

// export const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

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
