import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./config";

const auth = getAuth(app);

// Signup
export const signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Login
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);

export { auth };
