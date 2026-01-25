import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPasswordpage() {

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    async function resetPassword() {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/validate-otp', {
                email: email,
                otp: otp,
                newPassword: newPassword
            });
            toast.success("Password reset successful");
            setLoading(false);
            setOtpSent(false);
            navigate("/login");
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to reset password");
            setLoading(false);
        }

    }

    async function sentOtp() {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        setLoading(true);
        try {

            await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/send-otp/' + email);
            toast.success("OTP sent to your email");
            setLoading(false);
            setOtpSent(true);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to send OTP");
            setLoading(false);
        }

    }
    return (
        <div className="w-full h-full bg-[url('/background.jpg')] flex bg-center bg-cover bg-no-repeat">
            <div className="w-[50%] h-full flex flex-col justify-center items-center">
                <img
                    className="w-[200px] h-[200px] object-cover"
                />
                <h1
                    className="text-[50px] text-white font-bold ">
                </h1>
                <p
                    className="text-blue-100 italic text-[30px]"></p>

            </div>
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
                        {otpSent ? "Reset Password" : "Forgot Password"}
                    </motion.h1>


                    {
                        otpSent ? (
                            <>
                                <motion.input
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    type="email" placeholder="Enter Your Email"
                                    className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <motion.input
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    type="text" placeholder="Enter OTP"
                                    className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-mono"
                                    onChange={(e) => setOtp(e.target.value)} />
                                <motion.input
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    type="password" placeholder="Enter New Password"
                                    className="w-[400px] h-[50px] mb-[20px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <motion.input
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    type="password" placeholder="Confirm New Password"
                                    className="w-[400px] h-[50px] mb-[20px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <motion.button
                                    onClick={() => resetPassword()}
                                    disabled={loading}
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
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
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => setOtpSent(false)}
                                    className="mt-4 text-sm text-blue-500 hover:text-white underline bg-transparent border-none cursor-pointer"
                                >
                                    Back to Email
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.input
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    type="email" placeholder="Enter Your Email"
                                    className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <motion.button
                                    onClick={() => sentOtp()}
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
                                        "Send OTP"
                                    )}
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={() => setOtpSent(true)}
                                    className="mt-4 text-sm text-blue-500 hover:text-white underline bg-transparent border-none cursor-pointer"
                                >
                                    Already have a code?
                                </motion.button>
                            </>
                        )
                    }

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