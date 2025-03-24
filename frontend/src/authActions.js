// // src/authActions.js
// import { auth } from "./firebase";

// export const signUp = (email, password) => {
//   return auth
//     .createUserWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log("Signed up:", user);
//       return user;
//     })
//     .catch((error) => {
//       console.error(error.message);
//     });
// };

// export const login = (email, password) => {
//   return auth
//     .signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log("Logged in:", user);
//       return user;
//     })
//     .catch((error) => {
//       console.error(error.message);
//     });
// };

// export const logout = () => {
//   return auth
//     .signOut()
//     .then(() => {
//       console.log("Logged out");
//     })
//     .catch((error) => {
//       console.error(error.message);
//     });
// };

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
