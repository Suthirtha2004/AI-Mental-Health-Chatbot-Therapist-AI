import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCqed6cmh51AJpkR5F74-xkUOYqH9P8kqc",
  authDomain: "therapist-ai-6101e.firebaseapp.com",
  projectId: "therapist-ai-6101e",
  storageBucket: "therapist-ai-6101e.firebasestorage.app",
  messagingSenderId: "696130990923",
  appId: "1:696130990923:web:62b48d580bd2ae0717eece",
  measurementId: "G-L6PH3E08BT"
};
// const firebaseConfig = {
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "SENDER_ID",
//   appId: "APP_ID"
// };

const app = initializeApp(firebaseConfig);

export default app;
