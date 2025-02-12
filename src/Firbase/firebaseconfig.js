// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"




const firebaseConfig = {
  apiKey: "AIzaSyAm0wsmD9iX0xU6oiZCflHBc2oc5RoJook",
  authDomain: "chat-app-bdbe2.firebaseapp.com",
  databaseURL: "https://chat-app-bdbe2-default-rtdb.firebaseio.com",
  projectId: "chat-app-bdbe2",
  storageBucket: "chat-app-bdbe2.firebasestorage.app",
  messagingSenderId: "512810990905",
  appId: "1:512810990905:web:a86bd18fafc35805d17ce8",
  measurementId: "G-ET5ECJH420"
};


// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const db = getFirestore(app)



export default app