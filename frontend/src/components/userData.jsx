import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserData() {
    const { user, logout } = useAuth();
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("token");
        localStorage.setItem("cart", JSON.stringify([]));
        navigate("/login");
    };

    return (
        <div className="relative flex items-center">
            {user ? (
                <div>
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        {user.image && (
                            <img
                                src={user.image}
                                className="w-10 h-10 rounded-full object-cover text-2xl border shadow-sm"
                            />
                        )}
                        <p className="text-2xl text-amber-50">{user.firstName}</p>
                    </div>

                    {/* Dropdown Menu */}
                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 border z-50">
                            <button
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                                onClick={() => navigate("/orders")}
                            >
                                My Orders
                            </button>
                            {user.role === "admin" && (
                                <button
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-blue-600"
                                    onClick={() => navigate("/admin")}
                                >
                                    Admin Panel
                                </button>
                            )}
                            <button
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-[150px] flex flex-row">
                    <Link to="/login" className="  mx-2 px-4 py-2 bg-white text-accent rounded-full ">Login</Link>
                    <Link to="/register" className="  mx-2 px-4 py-2 bg-white text-accent rounded-full ">Register</Link>
                </div>
            )}
        </div>
    );
}
