import React, { useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.init";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const axiosSecure = useAxiosSecure(); 

  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (isRegistering) return;

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      // console.log(firebaseUser.email);

      try {
        const res = await axiosSecure.get(`/users/${firebaseUser.email}`);
        // console.log(res);
        const dbUser = res.data;
        // console.log(dbUser);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || dbUser?.name || null,
          photoURL: firebaseUser.photoURL || dbUser?.photoURL || null,
          role: dbUser?.role || "user",
          dbId: dbUser?._id || null,
        });
      } catch (err) {
        console.error("Failed to fetch DB user profile:", err);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          role: "user",
          dbId: null,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosSecure, isRegistering]);

  // console.log(user);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    registerUser,
    signInUser,
    googleLogin,
    updateUser,
    logoutUser,
    isRegistering,
    setIsRegistering
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
