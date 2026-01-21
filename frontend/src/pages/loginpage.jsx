import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";


export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/users/googlelogin", {
        access_token: response.access_token
      })
        .then((res) => {
          console.log("Google login response:", res.data);
          toast.success(res.data.message);
          //check block status
          if (res.data.isBlocked) {
            toast.error("Your account has been blocked. Please contact support.");
            setIsLoading(false);
            return;
          }
          // SAVE TOKEN AND USER
          localStorage.setItem("token", res.data.token);

          // Decode token to get user info
          try {
            const payload = JSON.parse(atob(res.data.token.split('.')[1]));
            localStorage.setItem("user", JSON.stringify(payload));
          } catch (e) {
            console.warn("Failed to decode token:", e);
          }

          if (res.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          setIsLoading(true);

        })
        .catch((error) => {
          console.error("Google login failed:", error);
          console.log("Error response data:", error.response?.data);
          toast.error(error?.response?.data?.message || "Google login failed");
          setIsLoading(false);
        });
    },

    onError: (error) => {
      toast.error("Google Login Failed");
      console.log("Google login error:", error);
    }
  });


  const navigate = useNavigate();

  async function login() {
    console.log("log clicked");
    console.log("Email:", email);
    console.log("Password:", password);
    setIsLoading(true);

    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/login", {
        email: email,
        password: password
      });
      console.log("Login response:", res.data);
      // Log token received from backend for debugging
      console.log("Token (from response):", res.data.token);
      toast.success(res.data.message);

      localStorage.setItem("token", res.data.token);

      // Backend returns token but not the role directly.
      // Decode the JWT payload to obtain the role when needed.
      const token = res.data.token || localStorage.getItem("token");
      console.log("Token (stored):", token);
      let role = res.data.role;
      if (!role && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          role = payload.role;
          // Save user object to localStorage
          localStorage.setItem("user", JSON.stringify(payload));
        } catch (e) {
          console.warn("Failed to decode token payload:", e);
        }
      }

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.response?.data?.message || "Login failed");
      setIsLoading(false);
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
          className="w-[450px] h-[600px] backdrop-blur-lg shadow-2xl rounded-2xl flex flex-col justify-center items-center"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-[40px] font-bold mb-[20px] text-blue-600"
          >
            Login
          </motion.h1>
          <motion.input
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Your Email"
            className="w-[400px] h-[50px] mb-[25px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <motion.input
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Your Password"
            className="w-[400px] h-[50px] mb-[20px] rounded-lg border border-blue-300 p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <motion.button
            onClick={login}
            disabled={isLoading}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-[400px] h-[50px] font-bold text-[20px] rounded-lg transition ${isLoading
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600"
              }`}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block"
              >
                ⟳
              </motion.span>
            ) : (
              "Login"
            )}
          </motion.button>
          <motion.button
            onClick={googleLogin}
            disabled={isLoading}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-[400px] mt-[30px] h-[50px] font-bold text-[20px] rounded-lg transition ${isLoading
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-white hover:text-red-600 border border-red-600"
              }`}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block"
              >
                ⟳
              </motion.span>
            ) : (
              <>
                Login With <FaGoogle className="inline ml-2 mb-1 " />
              </>
            )}
          </motion.button>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-[20px] text-white"
          >
            <span className="text-black">Don't have an account? </span>
            <Link to="/register" className="text-blue-500 font-bold hover:underline">Register</Link>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-[10px] text-white"
          >
            <Link to="/forgot-password" className="text-blue-500 font-bold hover:underline">Forgot Password?</Link>
          </motion.div>

        </motion.div>

      </div>
      {isLoading && <Loader />}
    </div>
  )
}