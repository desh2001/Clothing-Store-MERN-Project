import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ShoppingBag, ShieldCheck, ChevronDown } from "lucide-react";

export default function UserData() {
    const [user, setUser] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => setUser(res.data))
                .catch((err) => {
                    console.error("User fetch error:", err);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        localStorage.setItem("cart", JSON.stringify([]));
        window.location.reload(); // Ensure all states are reset
    };

    const getInitials = (firstName) => {
        return firstName ? firstName.charAt(0).toUpperCase() : "U";
    };

    if (loading) return null; // Or a subtle skeleton loader

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {user ? (
                <div className="relative">
                    {/* User Trigger */}
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <div className="relative">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.firstName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                                    {getInitials(user.firstName)}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-semibold text-slate-700 leading-none">
                                {user.firstName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">Account</p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {openMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                    <p className="text-sm font-semibold text-slate-800">Hello, {user.firstName}!</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>

                                {/* Items */}
                                <div className="p-1">
                                    <button
                                        onClick={() => { navigate("/orders"); setOpenMenu(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <ShoppingBag size={18} />
                                        <span>My Orders</span>
                                    </button>

                                    {user.role === "admin" && (
                                        <button
                                            onClick={() => { navigate("/admin"); setOpenMenu(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            <ShieldCheck size={18} />
                                            <span>Admin Panel</span>
                                        </button>
                                    )}

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 rounded-full transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                    >
                        Register
                    </Link>
                </div>
            )}
        </div>
    );
}
