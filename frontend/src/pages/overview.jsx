import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addCart, getCart } from "../lib/cart";

export default function ProductOverview() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/products/" + params.productID)
            .then((response) => {
                setProduct(response.data);
                setStatus("success");
            })
            .catch(() => {
                toast.error("Product Not Found");
                setStatus("error");
            });
    }, [params.productID]);

    return (
        <>
            {/* 🔄 Loader */}
            {status === "loading" && <Loader />}

            {/* ❌ Error */}
            {status === "error" && (
                <h1 className="text-center text-red-600 mt-10 text-2xl font-semibold">
                    Error Loading Product
                </h1>
            )}

            {/* ✅ Success */}
            {status === "success" && product && (
                <div className="w-full min-h-[calc(100vh-100px)] 
                                bg-blue-50 p-6 flex flex-col lg:flex-row gap-6">

                    {/* 🖼 Image Section */}
                    <div className="lg:w-1/2 w-full bg-white rounded-2xl 
                                    shadow-lg p-6 flex justify-center items-center 
                                    transition-transform duration-300 hover:scale-[1.01]">
                        <ImageSlider images={product.images || []} />
                    </div>

                    {/* 📄 Product Details */}
                    <div className="lg:w-1/2 w-full bg-white rounded-2xl 
                                    shadow-lg p-8 flex flex-col gap-6">

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Product ID: {product.productID}
                            </p>

                            <span className="inline-block mt-2 px-3 py-1 
                                             rounded-full bg-blue-100 
                                             text-blue-600 text-sm font-medium">
                                {product.category}
                            </span>

                            {product.altNames && product.altNames.length > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Also known as: {product.altNames.join(" | ")}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-blue-50 p-5 rounded-lg 
                                        text-gray-700 leading-relaxed shadow-sm">
                            {product.description}
                        </div>

                        {/* 💰 Price */}
                        <div className="flex items-center gap-4">
                            {product.labelledPrice && product.labelledPrice > product.price && (
                                <span className="text-xl text-gray-400 line-through">
                                    Rs.{product.labelledPrice.toFixed(2)}
                                </span>
                            )}
                            <span className="text-4xl font-bold text-blue-600">
                                Rs.{product.price.toFixed(2)}
                            </span>
                        </div>

                        {/* 🔘 Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">

                            {/* Add to Cart */}
                            <button
                                onClick={() => {
                                    addCart(product, 1);
                                    navigate("/cart");
                                }}
                                className="flex-1 bg-gradient-to-r 
                                           from-blue-600 to-indigo-600 
                                           hover:from-blue-700 hover:to-indigo-700 
                                           text-white py-3 rounded-xl 
                                           text-lg font-semibold shadow-md 
                                           transition-all duration-300 
                                           hover:-translate-y-1"
                            >
                                Add to Cart
                            </button>

                            {/* Buy Now */}
                            <button
                                onClick={() => {
                                    navigate("/checkout", {
                                        state: [{
                                            productID: product.productID,
                                            name: product.name,
                                            price: product.price,
                                            labelledPrice: product.labelledPrice,
                                            quantity: product.quantity || 1,
                                            image: product.images[0],
                                        }],
                                    });
                                    console.log(getCart());
                                }}
                                className="flex-1 bg-white border border-blue-300 
                                           hover:bg-blue-50 text-blue-700 
                                           py-3 rounded-xl text-lg font-semibold 
                                           shadow-sm transition-all duration-300 
                                           hover:-translate-y-1"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
