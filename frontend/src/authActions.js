import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Signed up:", user);
    return user;
  } catch (error) {
    console.error("Sign-up error:", error.message);
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Logged in:", user);
    return user;
  } catch (error) {
    console.error("Login error:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
