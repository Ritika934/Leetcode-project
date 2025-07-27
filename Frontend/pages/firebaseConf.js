import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

  const firebaseConfig = {
  apiKey: "AIzaSyDdIG-Q1G1psm5oLWT87pukTyEEMPryh_Y",
  authDomain: "ritika-s-coding-platform.firebaseapp.com",
  projectId: "ritika-s-coding-platform",
   storageBucket: "ritika-s-coding-platform.firebasestorage.app",
   messagingSenderId: "367760981786",
  appId: "1:367760981786:web:c7943ac6552af1273cf6a3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

 const signInWithGoogle = () =>signInWithPopup(auth, googleProvider);


 
 export default signInWithGoogle;