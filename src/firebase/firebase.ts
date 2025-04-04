// Import the Firebase SDK components
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfwoawrvsx2kVg87BQofO266uPYiKpc8A",
    authDomain: "gearwell-fc80c.firebaseapp.com",
    projectId: "gearwell-fc80c",
    storageBucket: "gearwell-fc80c.firebasestorage.app",
    messagingSenderId: "587713260077",
    appId: "1:587713260077:web:209b3fdd728c169bb4a6a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;