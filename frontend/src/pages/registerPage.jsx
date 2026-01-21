import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { motion } from "framer-motion";


export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isloading, setisLoading] = useState(false);

  const navigate = useNavigate();

  async function register() {
    console.log("Reigister clicked");
    if (firstName.trim() == "") {
      toast.error("First name is required");
      return;
    }
    if (lastName.trim() == "") {
      toast.error("Last name is required");
      return;
    }
    if (email.trim() == "") {
      toast.error("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setisLoading(true);



    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/", {
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      console.log("Register response:", res.data);

      if (res.data.message === "OTP sent") {
        toast.success("Verification code sent to your email");
        setShowOtpInput(true);
        setisLoading(false);
        return;
      }

      toast.success(res.data.message);
      navigate("/login");

    } catch (error) {
      console.error("Register failed:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
      setisLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }
    setisLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/verify-signup-otp", {
        email: email.trim(),
        otp: otp
      });

      toast.success(res.data.message);
      navigate("/login");

    } catch (error) {
      console.error("OTP Verification failed:", error);
      toast.error(error?.response?.data?.message || "Verification failed");
      setisLoading(false);
    }
  }

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleResendOtp() {
    if (timer > 0) return;
    setisLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/resend-otp", {
        email: email.trim()
      });
      toast.success(res.data.message);
      setTimer(60);
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setisLoading(false);
    }
  }


  return (
    <div className="w-full h-full bg-[url('/background.jpg')] flex bg-center bg-cover bg-no-repeat">
      <div className="w-[50%] h-full flex flex-col justify-center items-center">
        <img

          className="w-[200px] h-[200px] object-cover"
        />
        <h1
          className="text-[50px] text-golden text-shadow-2xs text-shadow-accent font-bold ">
        </h1>
        <p
          className="text-white italic text-[30px]"></p>

      </div>
      <div className="w-[50%] h-full flex justify-center items-center ">
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-[450px] h-[600px] backdrop-blur-lg shadow-2xl rounded-2xl flex flex-col justify-center items-center"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-[40px] font-bold mb-[20px] text-accent text-shadow-white"
          >
            {showOtpInput ? "Verify Email" : "Register"}
          </motion.h1>

          {!showOtpInput ? (
            <>
              <motion.input
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Your First Name"
                className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden "
              />
              <motion.input
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Your Last Name"
                className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden "
              />
              <motion.input
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
                className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden "
              />
              <motion.input
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Your Password"
                className="w-[400px] h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden "
              />
              <motion.input
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Your Password"
                className="w-[400px] h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden "
              />
            </>
          ) : (
            <motion.input
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter 6-digit Code"
              maxLength={6}
              className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-golden text-center tracking-widest font-mono"
            />
          )}

          <motion.button
            onClick={showOtpInput ? handleVerifyOtp : register}
            disabled={isloading}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: isloading ? 1 : 1.02 }}
            whileTap={{ scale: isloading ? 1 : 0.98 }}
            className={`w-[400px] h-[50px] font-bold text-[20px] rounded-lg transition ${isloading
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-accent text-white hover:bg-transparent hover:text-accent"
              }`}
          >
            {isloading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block"
              >
                ⟳
              </motion.span>
            ) : (
              showOtpInput ? "Verify Code" : "Register"
            )}
          </motion.button>

          {showOtpInput && (
            <div className="flex flex-col items-center mt-4">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleResendOtp}
                disabled={timer > 0 || isloading}
                className={`text-sm ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-golden hover:text-white underline"}`}
              >
                {timer > 0 ? `Resend code in ${timer}s` : "Resend Verification Code"}
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-blue-300 hover:text-white underline"
                onClick={() => setShowOtpInput(false)}
              >
                Back to Register
              </motion.button>
            </div>
          )}

          {!showOtpInput && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-[20px] text-white"
            >
              <span className="text-black">Do you have an account? </span>
              <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
            </motion.div>
          )}



        </motion.div>

      </div>
      {isloading && <Loader />}
    </div>
  )
}