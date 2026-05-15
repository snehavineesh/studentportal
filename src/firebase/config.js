import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRL8amxXvCG28wOjAqhlSuL7YA1y9lt_Q",
  authDomain: "portal-3ab33.firebaseapp.com",
  projectId: "portal-3ab33",
  storageBucket: "portal-3ab33.firebasestorage.app",
  messagingSenderId: "1004224169572",
  appId: "1:1004224169572:web:f880ccfa2e3c3983778171",
  measurementId: "G-CRJDRFD6R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
