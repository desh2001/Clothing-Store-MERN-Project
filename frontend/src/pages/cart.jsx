import { useState } from "react";
import { addCart, getCart, getCartTotal } from "../lib/cart";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function Cart() {
    const [cart, setCart] = useState(getCart() || []);

    const safe = (num) => Number(num) || 0; // helper
    const formatCurrency = (v) => `LKR.${safe(v).toFixed(2)}`;

    return (
        <div className="w-full flex flex-col items-center p-6 bg-gray-50 min-h-[70vh]">
            <header className="w-[90%] max-w-5xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                    <p className="text-sm text-gray-500">Review items before checkout</p>
                </div>
                <div className="bg-white shadow px-4 py-2 rounded-lg flex items-center gap-3">
                    <span className="text-sm text-gray-600">Items</span>
                    <span className="bg-accent text-white text-sm font-semibold px-3 py-1 rounded-full">{cart.length}</span>
                </div>
            </header>

            {cart.length === 0 ? (
                <div className="lg:w-[80%] w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
                    <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                    <Link to="/products" className="mt-2 px-5 py-2 bg-accent text-white rounded-md">Browse Products</Link>
                </div>
            ) : (
                <div className="lg:w-[90%] w-full max-w-5xl grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                        {cart.map((item) => {
                            const price = safe(item?.price);
                            const labelled = safe(item?.labelledPrice);
                            const qty = safe(item?.quantity);

                            return (
                                <div
                                    key={item.productID}
                                    className="w-full rounded-xl overflow-hidden shadow-sm bg-white flex flex-col md:flex-row gap-4 p-4 items-start md:items-center"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-20 md:w-36 md:h-28 object-cover rounded-md"
                                    />

                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {item.name.length > 50 ? item.name.substring(0, 50) + "..." : item.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-3">
                                            {labelled > price && (
                                                <span className="text-sm text-gray-400 line-through">{formatCurrency(labelled)}</span>
                                            )}
                                            <span className="text-lg text-accent font-semibold">{formatCurrency(price)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">SKU: {item.productID}</div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 ml-auto md:ml-0">
                                        <div className="flex flex-col items-center bg-gray-100 rounded-md p-2">
                                            <button
                                                onClick={() => {
                                                    addCart(item, 1);
                                                    setCart(getCart());
                                                }}
                                                className="p-1 rounded hover:bg-gray-200"
                                                aria-label="Increase quantity"
                                            >
                                                <FaChevronUp className="w-5 h-5 text-accent" />
                                            </button>
                                            <span className="text-lg font-medium">{qty}</span>
                                            <button
                                                onClick={() => {
                                                    addCart(item, -1);
                                                    setCart(getCart());
                                                }}
                                                className="p-1 rounded hover:bg-gray-200"
                                                aria-label="Decrease quantity"
                                            >
                                                <FaChevronDown className="w-5 h-5 text-accent" />
                                            </button>
                                        </div>

                                        <div className="text-sm font-semibold">{formatCurrency(price * qty)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <aside className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 lg:sticky lg:top-24">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(getCartTotal())}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium">Free</span>
                        </div>
                        <div className="border-t mt-2 pt-3 flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-xl font-bold text-accent">{formatCurrency(getCartTotal())}</span>
                        </div>

                        <Link
                            to="/checkout"
                            state={cart}
                            className="mt-2 block text-center px-4 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link to="/products" className="mt-1 block text-center px-4 py-2 border rounded-md text-gray-700">Continue Shopping</Link>
                    </aside>
                </div>
            )}
        </div>
    );
}
