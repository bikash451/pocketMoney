import {
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCalls";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { Button } from "./ui/button";

export const SocialAuth = ({ isLoading, setLoading }) => {
    const { setCredentials } = useStore((state) => state);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        try {
            setLoading(true);
            
            // 1. Sign in with Firebase
            const result = await signInWithPopup(auth, provider);
            
            // 2. Get Google ID token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.idToken;
            
            // 3. Verify with your backend
            const { data: res } = await api.post('/auth/google', { token });
            
            // 4. Handle success
            if (res?.user) {
                const userInfo = { ...res.user, token: res.token };
                localStorage.setItem("user", JSON.stringify(userInfo));
                setCredentials(userInfo);
                navigate("/overview", { replace: true });
            }
            
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            
            if (error.code === 'auth/popup-blocked') {
                toast.error("Please allow popups for this site");
            } else {
                toast.error(error.message || "Google sign-in failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={signInWithGoogle}
            disabled={isLoading}
            variant="outline"
            className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
            type="button"
        >
            <FcGoogle className="mr-2 size-5" />
            {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>
    );
};