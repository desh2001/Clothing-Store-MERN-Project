import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { motion } from "framer-motion";


export default function RegisterPage(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isloading , setisLoading] = useState(false);
  
    const navigate = useNavigate();

    async function register(){
        console.log("Reigister clicked");
        if(firstName.trim()=="" ){
            toast.error("First name is required");
            return;
        }
        if(lastName.trim()=="" ){
            toast.error("Last name is required");
            return;
        }
        if(email.trim()=="" ){
            toast.error("Email is required");
            return;
        }
        if(password !== confirmPassword ){
            toast.error("Passwords do not match");
            return;
        }

       setisLoading(true);
        
  

        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+"/users/", {
                email: email.trim(),
                password: password.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });
            console.log("Register response:", res.data);
            console.log("Token (from response):", res.data.token);
            toast.success(res.data.message);

            navigate("/login");
            
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error?.response?.data?.message || "Login failed");
            setisLoading(false);
        }
          }


    return(
        <div className="w-full h-full bg-[url('/background.jpg')] flex bg-center bg-cover bg-no-repeat">
            <div className="w-[50%] h-full flex flex-col justify-center items-center">
                <img 
                    src="/logo.png" 
                    alt="logo" 
                    className="w-[200px] h-[200px] object-cover"
                />
                <h1 
                    className="text-[50px] text-golden text-shadow-2xs text-shadow-accent font-bold ">Plug In. Power Up. Play Hard
                    </h1>
                <p 
                    className="text-white italic text-[30px]">Your Ulitimate Destination for Gaming Gear</p>

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
                    <motion.button
                      onClick={register}
                      disabled={isloading}
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ scale: isloading ? 1 : 1.02 }}
                      whileTap={{ scale: isloading ? 1 : 0.98 }}
                      className={`w-[400px] h-[50px] font-bold text-[20px] rounded-lg transition ${
                        isloading
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
                        <span>Do you have an account? </span>
                        <Link to="/login" className="text-golden font-bold hover:underline">Login</Link>
                    </motion.div>

                </motion.div>

            </div>
            {isloading && <Loader/>}
        </div>
    )
}