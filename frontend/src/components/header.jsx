import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import UserData from "./userData";
import { getCartItemCount } from "../lib/cart";

export default function Header() {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const syncCartCount = () => setCartCount(getCartItemCount());
        syncCartCount();

        window.addEventListener("storage", syncCartCount);
        window.addEventListener("cartUpdated", syncCartCount);
        window.addEventListener("focus", syncCartCount);

        return () => {
            window.removeEventListener("storage", syncCartCount);
            window.removeEventListener("cartUpdated", syncCartCount);
            window.removeEventListener("focus", syncCartCount);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/products", label: "Products" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" }
    ];

    return (
        <>
            {/* HEADER */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md shadow-md py-3"
                    : "bg-white py-5 shadow-sm"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Icon" className="h-20 w-20 object-contain" />
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path} className="relative group py-2">
                                <span
                                    className={`text-sm font-semibold transition ${isActive(path)
                                        ? "text-blue-600"
                                        : "text-slate-600 hover:text-blue-600"
                                        }`}
                                >
                                    {label}
                                </span>

                                <span
                                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform origin-left ${isActive(path)
                                        ? "scale-x-100"
                                        : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* ICONS */}
                    <div className="flex items-center gap-5">
                        <button className="hidden sm:block text-slate-500 hover:text-blue-600">
                            <Search size={20} />
                        </button>

                        <div className="hidden md:block">
                            <UserData />
                        </div>

                        {/* CART */}
                        <Link to="/cart" className="relative">
                            <div className="p-2 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition">
                                <ShoppingCart size={20} />
                            </div>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        </Link>

                        {/* MOBILE MENU */}
                        <button
                            className="lg:hidden"
                            onClick={() => setSideBarOpen(true)}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* SPACER */}
            <div className={scrolled ? "h-[80px]" : "h-[100px]"} />

            {/* MOBILE SIDEBAR */}
            <AnimatePresence>
                {sideBarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSideBarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 flex flex-col"
                        >
                            <div className="p-6 flex justify-between items-center border-b">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setSideBarOpen(false)}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col gap-4">
                                {navLinks.map(({ path, label }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setSideBarOpen(false)}
                                        className="text-lg hover:text-blue-600"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto p-6 border-t bg-slate-50">
                                <UserData />
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    © 2024 Clothing Store
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
