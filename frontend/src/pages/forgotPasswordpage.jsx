import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordpage() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const { resetPassword } = useAuth();

    async function handleResetPassword() {
        console.log("Initiating password reset for:", email);
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            console.log("Calling resetPassword...");
            await resetPassword(email);
            console.log("resetPassword successful");
            toast.success("Password reset email sent. Check your inbox.");
            setEmail("");
        } catch (err) {
            console.error("Reset password error:", err);
            // Firebase errors often have a code property
            const errorMessage = err.code ? `Error: ${err.code}` : (err.message || "Failed to send reset email");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[50%] h-full flex justify-center items-center ">
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-[450px] min-h-[400px] backdrop-blur-lg shadow-2xl rounded-2xl flex flex-col justify-center items-center p-8"
                >
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-[40px] font-bold mb-[20px] text-blue-600 text-center"
                    >
                        Forgot Password
                    </motion.h1>

                    <motion.input
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        type="email" placeholder="Enter Your Email"
                        className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <motion.button
                        onClick={handleResetPassword}
                        disabled={loading}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className={`w-[400px] h-[50px] font-bold text-[20px] rounded-lg transition ${loading
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600"
                            }`}
                    >
                        {loading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="inline-block"
                            >
                                ⟳
                            </motion.span>
                        ) : (
                            "Reset Password"
                        )}
                    </motion.button>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-[20px] text-white"
                    >
                        <span className="text-black">Remember your password? </span>
                        <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
                    </motion.div>

                </motion.div>

            </div>
            {loading && <Loader />}
        </div>
    )
}