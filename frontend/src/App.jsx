import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/homepage";
import Admin from "./pages/adminpage";
import Register from "./pages/registerPage";
import Login from "./pages/loginpage";
import './App.css'
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPasswordpage from "./pages/forgotPasswordpage";
import ReviewAddPage from "./pages/reviewAddPage.jsx";


function App() {
  return (
    <GoogleOAuthProvider clientId="903023338138-8sphst1m33l8ppcl1thmc5pqab3rlmtu.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="w-screen h-screen bg-primary text-secondary    ">
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/forgot-password" element={<ForgotPasswordpage />} />
            <Route path="/reviews/add" element={<ReviewAddPage />} />
          </Routes>

        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}


export default App;
