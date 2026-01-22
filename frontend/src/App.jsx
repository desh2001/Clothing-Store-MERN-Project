import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homepage";
import Admin from "./pages/adminpage";
import Register from "./pages/registerPage";
import Login from "./pages/loginpage";
import './App.css'
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ForgotPasswordpage from "./pages/forgotPasswordpage";
import ReviewAddPage from "./pages/reviewAddPage.jsx";


function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}


export default App;
