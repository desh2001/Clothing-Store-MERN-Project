import { useState, useEffect } from "react";
import { addCart, getCart, getCartTotal } from "../lib/cart";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
    const location = useLocation();
    const [cart, setCart] = useState(location.state || []);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // Pre-fill name if user is logged in and name is empty
    useEffect(() => {
        if (user && !name) {

            setName(`${user.firstName} ${user.lastName}`);
        }
    }, [user]);

    // Redirect if cart is empty
    if (!location.state || cart.length === 0) {
        return <Navigate to="/products" />;
    }

    const safe = (num) => Number(num) || 0;
    const formatCurrency = (v) => `LKR.${safe(v).toFixed(2)}`;

    async function submitOrder() {
        if (authLoading) return; // Wait for auth check

        if (!user) {
            toast.error("You must be logged in to place an order!");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            // Should not happen if user object exists, but safety check
            toast.error("Authentication error. Please login again.");
            navigate("/login");
            return;
        }

        if (!address || !phoneNumber) {
            toast.error("Please provide your address and phone number");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                items: cart.map((i) => ({
                    productID: i.productID,
                    quantity: safe(i.quantity),
                })),
                name: name || undefined,
                address: address,
                phonenumber: phoneNumber,
                note: note || undefined,
            };

            const res = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/orders/",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status >= 200 && res.status < 300) {
                toast.success("Order placed successfully!");
                localStorage.removeItem("cart");
                setCart([]);
                setNote("");
                navigate("/orders");
            }

        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                navigate("/login");
            } else {
                toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col items-center p-6 bg-gray-50 min-h-[70vh]">
            <header className="w-[90%] max-w-5xl mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                <p className="text-sm text-gray-500">Confirm your order and place it</p>
            </header>

            <div className="w-[90%] max-w-5xl grid grid-cols-12 gap-6">
                {/* Cart Items */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    {cart.map((item) => {
                        const price = safe(item.price);
                        const qty = safe(item.quantity);

                        return (
                            <div
                                key={item.productID}
                                className="w-full rounded-xl shadow-sm bg-white 
                                           flex flex-col md:flex-row gap-4 p-4 items-start md:items-center"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-20 md:w-36 md:h-28 object-cover rounded-md"
                                />

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {item.name.length > 50
                                            ? item.name.substring(0, 50) + "..."
                                            : item.name}
                                    </h3>
                                    <div className="mt-1 text-lg font-semibold text-accent">
                                        {formatCurrency(price)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        SKU: {item.productID}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex flex-col items-center bg-gray-100 rounded-md p-2">
                                        <button
                                            onClick={() => {
                                                addCart(item, 1);
                                                setCart(getCart());
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <FaChevronUp />
                                        </button>

                                        <span className="text-lg font-medium">{qty}</span>

                                        <button
                                            onClick={() => {
                                                addCart(item, -1);
                                                setCart(getCart());
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <FaChevronDown />
                                        </button>
                                    </div>

                                    <div className="text-sm font-semibold">
                                        {formatCurrency(price * qty)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <aside className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(getCartTotal())}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-accent">
                            {formatCurrency(getCartTotal())}
                        </span>
                    </div>

                    <input
                        type="text"
                        placeholder="Name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />

                    <textarea
                        placeholder="Add a note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                    />

                    <button
                        onClick={submitOrder}
                        disabled={loading || authLoading}
                        className="w-full py-3 bg-accent text-white rounded-md 
                                   disabled:opacity-60"
                        title={!user ? "Please login to place order" : ""}
                    >
                        {loading ? "Placing Order..." : "Order Now"}
                    </button>

                    <Link
                        to="/cart"
                        className="block text-center py-2 border rounded-md"
                    >
                        Back to Cart
                    </Link>
                </aside>
            </div>
        </div>
    );
}
