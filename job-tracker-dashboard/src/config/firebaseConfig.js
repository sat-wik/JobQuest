// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeAJGklu_GzbzqSWWeXweZpwHOXylaruU",
  authDomain: "job-tracker-5d480.firebaseapp.com",
  projectId: "job-tracker-5d480",
  storageBucket: "job-tracker-5d480.appspot.com",
  messagingSenderId: "606147018769",
  appId: "1:606147018769:web:01618574836361ea16f1b0",
  measurementId: "G-HVY6WN6KRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
