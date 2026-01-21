import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuBoxes } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { GoCodeReview } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";
import { motion } from "framer-motion"; // <- Import framer-motion
import toast from "react-hot-toast";
import AdminProductPage from "./admin/adminProductpage";
import AdminAddProductPage from "./admin/adminAddProductPage";
import AdminUpdateProductPage from "./admin/adminUpdateProductPage";
import AdminOrderPage from "./admin/adminOrdersPage";
import AdminUserPage from "./admin/adminUserPage";
import AdminReviewPage from "./admin/adminReviewPage";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.role !== "admin") {
          window.location.href = "/";
        } else {
          setUser(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        window.location.href = "/";
      });
  }, []);

  // Animation variants for sidebar links
  const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05 },
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {user ? (
        <>
          {/* Sidebar */}
          <motion.div
            initial={{ x: -250 }} // start off-screen
            animate={{ x: 0 }} // slide in
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="w-[250px] bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col shadow-lg"
          >
            <div className="flex items-center justify-center h-[100px] border-b border-blue-700">
              <img src="/logo.png" className="w-[90px]" />
              <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
            </div>

            <nav className="flex-1 mt-6 space-y-2 text-lg">
              <motion.div
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link
                  to="/admin"
                  className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                    location.pathname === "/admin"
                      ? "bg-blue-700"
                      : "hover:bg-blue-400"
                  }`}
                >
                  <HiOutlineClipboardList className="mr-3 text-xl" /> Orders
                </Link>
              </motion.div>

              <motion.div variants={linkVariants} initial="hidden" animate="visible" whileHover="hover">
                <Link
                  to="/admin/products"
                  className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                    location.pathname === "/admin/products"
                      ? "bg-blue-700"
                      : "hover:bg-blue-400"
                  }`}
                >
                  <LuBoxes className="mr-3 text-xl" /> Products
                </Link>
              </motion.div>

              <motion.div variants={linkVariants} initial="hidden" animate="visible" whileHover="hover">
                <Link
                  to="/admin/users"
                  className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                    location.pathname === "/admin/users"
                      ? "bg-blue-700"
                      : "hover:bg-blue-400"
                  }`}
                >
                  <FiUsers className="mr-3 text-xl" /> Users
                </Link>
              </motion.div>

              <motion.div variants={linkVariants} initial="hidden" animate="visible" whileHover="hover">
                <Link
                  to="/admin/reviews"
                  className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                    location.pathname === "/admin/reviews"
                      ? "bg-blue-700"
                      : "hover:bg-blue-400"
                  }`}
                >
                  <GoCodeReview className="mr-3 text-xl" /> Reviews
                </Link>
              </motion.div>
            </nav>

            {/* Logout Button */}
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="p-4 border-t border-blue-700"
            >
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <BiLogOut className="mr-3 text-xl" /> Logout
              </button>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<AdminOrderPage />} />
              <Route path="/products" element={<AdminProductPage />} />
              <Route path="/add-items" element={<AdminAddProductPage />} />
              <Route path="/update-item" element={<AdminUpdateProductPage />} />
              <Route path="/users" element={<AdminUserPage />} />
              <Route path="/reviews" element={<AdminReviewPage />} />
            </Routes>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
