// ══════════════════════════════════════
//   FIREBASE CONFIG
// ══════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyDaEB3xTHzoh4sVHEPEPDGkYHP7ATs4MBI",
  authDomain: "performance-monitoring-2a162.firebaseapp.com",
  projectId: "performance-monitoring-2a162",
  storageBucket: "performance-monitoring-2a162.firebasestorage.app",
  messagingSenderId: "596328004410",
  appId: "1:596328004410:web:9e8e72792c3f0bc06d6e03"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
