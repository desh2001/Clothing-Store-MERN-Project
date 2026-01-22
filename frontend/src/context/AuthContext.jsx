import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from local storage", error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    async function syncUserWithBackend(firebaseUser) {
        if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const token = await firebaseUser.getIdToken();
            const displayName = firebaseUser.displayName || "";
            const [firstName, ...lastNameParts] = displayName.split(" ");
            const lastName = lastNameParts.join(" ");

            const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/firebase-sync", {
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                firstName: firstName || "User",
                lastName: lastName || "",
                photoURL: firebaseUser.photoURL
            });

            const backendUser = res.data.user;
            const backendToken = res.data.token;

            localStorage.setItem("token", backendToken);
            localStorage.setItem("user", JSON.stringify(backendUser));
            setUser(backendUser);

        } catch (error) {
            console.error("Backend sync failed:", error);
            // If sync fails but we have a user in local storage, we might want to keep it?
            // But we already initialized from local storage, so we just don't overwrite it with null here.
            // However, if the token is invalid, we might be in trouble. 
            // Ideally we'd try to get the token again or force logout if critical.
            // For now, preserving the "logged in" state from local storage is better than null.
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await syncUserWithBackend(currentUser);
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const value = {
        user,
        login,
        register,
        logout,
        resetPassword,
        googleLogin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
