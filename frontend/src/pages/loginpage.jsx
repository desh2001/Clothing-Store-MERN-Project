import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";


export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // AuthProvider handles syncing and setting user in storage
      // We just need to navigate on success
      

      // Determine navigation based on role if available (or default to home)
      // Since context updates asynchronously, we might rely on the token or just push to home/admin
      // For now, let's redirect to home. If admin check is needed, we can check localStorage

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      toast.success("Login successful");

    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await googleLogin();
      toast.success("Google Login Successful");
      // Navigation handled same as normal login
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google Login Failed");
    } finally {
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
            onClick={handleLogin}
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
            onClick={handleGoogleLogin}
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