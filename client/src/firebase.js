// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//temporary souls firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tourism-mgmt-d8a3b.firebaseapp.com",

  projectId: "tourism-mgmt-d8a3b",

  storageBucket: "tourism-mgmt-d8a3b.firebasestorage.app",

  messagingSenderId: "1002540428030",

  appId: "1:1002540428030:web:c7a7379cfa993804ffd3af",

  measurementId: "G-CDZ74M49MG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
