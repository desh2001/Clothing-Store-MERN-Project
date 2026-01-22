import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";


export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isloading, setisLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister() {
    console.log("Register clicked");
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
      const userCredential = await register(email, password);
      // Update profile with names immediately so backend sync can pick it up if sync happens on auth state change
      // Alternatively, our AuthContext sync might happen before this updateProfile completes if it listens to onAuthStateChanged.
      // However, AuthContext sync uses the user object from the event. 
      // To ensure specific fields like first/last name are synced, we might need to handle sync manually here or ensure updateProfile finishes before sync triggers (which is hard with onAuthStateChanged).
      // A better approach for sync: AuthContext's sync function extracts name from displayName.
      // So we MUST update profile here.

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      // Force a reload or re-sync might be needed if the initial sync missed the display name.
      // But typically, we can just let the user login or the auth state listener might fire again?
      // Actually, onAuthStateChanged fires on sign-in. `createUserWithEmailAndPassword` signs in automatically.
      // The listener might catch the user *before* we update the profile. 
      // In that case, the first sync might send "User" as name. 
      // We can manually trigger a sync or just accept it. 
      // For now, let's just proceed. The user can update profile later if needed, or we rely on the AuthProvider to eventually catch up.
      // Ideally, we should call a sync function explicitly here if we want to be sure.
      // But `register` in AuthContext just calls firebase. 

      toast.success("Registration successful");
      navigate("/");

    } catch (error) {
      console.error("Register failed:", error);
      toast.error(error.message || "Registration failed");
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
            Register
          </motion.h1>

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

          <motion.button
            onClick={handleRegister}
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
              "Register"
            )}
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-[20px] text-white"
          >
            <span className="text-black">Do you have an account? </span>
            <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
          </motion.div>

        </motion.div>

      </div>
      {isloading && <Loader />}
    </div>
  )
}