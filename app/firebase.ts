import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqK6WSt2eFTTslGenf8qP9FweQGPc9E4g",
  authDomain: "time-tracking-app-9b3e8.firebaseapp.com",
  projectId: "time-tracking-app-9b3e8",
  storageBucket: "time-tracking-app-9b3e8.firebasestorage.app",
  messagingSenderId: "18437397873",
  appId: "1:18437397873:web:50f9b4bf0b5b3c2879ead0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
