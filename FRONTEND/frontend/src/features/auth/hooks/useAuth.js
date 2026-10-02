import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { auth, googleProvider } from "../../../lib/firebase.js";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const {
    user,
    setUser,
    loading,
    setLoading,
  } = context;

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error("Google sign-in failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut(auth);
      return true;
    } catch (err) {
      console.error("Sign out failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    handleGoogleSignIn,
    handleLogout,
  };
};