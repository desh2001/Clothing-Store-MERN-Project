import { useEffect, useState } from "react";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductPage() {
    const [Products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!loaded) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/products/")
                .then((response) => {
                    setProducts(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    toast.error("Failed to load products");
                });
        }
    }, [loaded]);

    return (
        <div className="w-full h-full overflow-y-scroll bg-blue-50">
            <div className="w-full min-h-[calc(100%-100px)] flex">

                {!loaded ? (
                    <Loader />
                ) : (
                    <div className="w-full flex flex-col items-center gap-6 p-6 pt-[100px]">

                        {/* 🔍 Search Bar */}
                        <div className="w-full flex justify-center">
                            <div className="relative w-full max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={query}
                                    onChange={async (e) => {
                                        const value = e.target.value;
                                        setQuery(value);

                                        if (value.trim() === "") {
                                            const response = await axios.get(
                                                import.meta.env.VITE_BACKEND_URL + "/products/"
                                            );
                                            setProducts(response.data);
                                            setLoaded(true);
                                        } else {
                                            const response = await axios.get(
                                                import.meta.env.VITE_BACKEND_URL + "/products/search/" + value
                                            );
                                            setProducts(response.data);
                                            setLoaded(true);
                                        }
                                    }}
                                    className="w-full px-5 py-3 pr-12 rounded-full 
                                               border border-blue-200 bg-white 
                                               shadow-md focus:outline-none 
                                               focus:ring-4 focus:ring-blue-300 
                                               transition-all duration-300"
                                />

                                {/* Search Icon */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 🛒 Products */}
                        <div className="w-full flex flex-wrap justify-center gap-6 mt-6">
                            {Products.map((p) => (
                                <ProductCard key={p.productID} product={p} />
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
