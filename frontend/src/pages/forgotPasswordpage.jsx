import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";


export default function ForgotPasswordpage() {

    const [otpSent , setOtpSent] = useState(false);
    const [loading , setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate(); 

    async function resetPassword() {
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/validate-otp', {
                email: email,
                otp: otp,
                newPassword: newPassword
            });
            toast.success("Password reset successful");
            setLoading(false);
            setOtpSent(false);
            navigate("/login");
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to reset password");
            setLoading(false);
        }
        
    }

    async function sentOtp(){
        setLoading(true);
        try{
        
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/send-otp/'+email);
        toast.success("OTP sent to your email");
        setLoading(false);
        setOtpSent(true);
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to send OTP");
            setLoading(false);
        }

    }
    return(
        <div className="w-full h-full flex flex-col items-center justify-center">
            {
                loading && (
                    <Loader />
                )
            }
            {
                otpSent ? 
                ( <div className="w-[400px] h-[500px] flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-4">Enter OTP and New Password</h1>
                        <input 
                        type="text" placeholder="Enter OTP"
                        className="w-full p-2 mb-4 border-gray-400 rounded-2xl"
                        onChange = {(e) => setOtp(e.target.value)}/>
                        <input 
                            type="password" placeholder="Enter New Password"
                            className="w-full p-2 mb-4 border-gray-400 rounded-2xl"
                            onChange = {(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password" placeholder="Confirm New Password"
                            className="w-full p-2 mb-4 border-gray-400 rounded-2xl"
                            onChange = {(e) => setConfirmPassword(e.target.value)}
                        />  
                        <button  onClick={() => resetPassword()}
                            className="w-full bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600">
                                Reset Password </button>
                    </div>



                 ):
                    (
                       <div className="w-[400px] h-[400px] flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
                        <input 
                            type="email" placeholder="Enter Your Mail"
                            className="w-full p-2 mb-4 border-gray-400 rounded-2xl"
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                        <button  onClick={() => sentOtp()}
                            className="w-full bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600">
                                Send OTP </button>
                            

                    </div>
                       )
            }
        
            </div>
    )
}