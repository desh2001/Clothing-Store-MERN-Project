import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ProductDeleteButton from "../../components/productDeleteButton";

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/products/")
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
        <div className="w-full p-8 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-auto mx-auto max-w-6xl">
                {loaded ? (
                    <table className="min-w-full table-auto">
                        <thead className="bg-accent text-white">
                            <tr>
                                <th className="px-4 py-3 text-center">Image</th>
                                <th className="px-4 py-3 text-center">ProductID</th>
                                <th className="px-4 py-3 text-center">ProductName</th>
                                <th className="px-4 py-3 text-center">Price</th>
                                <th className="px-4 py-3 text-center">Labelled Price</th>
                                <th className="px-4 py-3 text-center">Category</th>
                                <th className="px-4 py-3 text-center">Brand</th>
                                <th className="px-4 py-3 text-center">Model</th>
                                <th className="px-4 py-3 text-center">Stock</th>
                                <th className="px-4 py-3 text-center">Availability</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr
                                    key={p.productID}
                                    className="odd:bg-slate-50 even:bg-white hover:bg-slate-100"
                                >
                                    <td className="px-4 py-3 flex items-center justify-center">
                                        <img
                                            src={p.images?.[0] ?? "/logo.png"}
                                            alt={p.name}
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">{p.productID}</td>
                                    <td className="px-4 py-3 text-center">{p.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        ₹{p.price.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="line-through text-slate-400 mr-2">
                                            ₹{p.labelledPrice.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">{p.category}</td>
                                    <td className="px-4 py-3 text-center">{p.brand}</td>
                                    <td className="px-4 py-3 text-center">{p.modelNumber}</td>
                                    <td className="px-4 py-3 text-right">{p.stock}</td>
                                    <td className="px-4 py-3 text-center">
                                        {p.isAvailable ? (
                                            <span className="inline-block px-2 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-full">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-sm bg-rose-100 text-rose-800 rounded-full">
                                                Out of stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="inline-flex justify-center items-center gap-2">
                                            <Link
                                                to="/admin/update-item"
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                                state={p}
                                            >
                                                Edit
                                            </Link>
                                            <ProductDeleteButton
                                                productID={p.productID}
                                                onDeleted={() => setLoaded(false)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Loader />
                )}
            </div>

            <Link
                to="/admin/add-items"
                className="w-[50px] h-[50px] flex items-center justify-center text-3xl rounded-full fixed right-5 bottom-5 hover:text-white hover:bg-accent border-2 border-accent"
                aria-label="Add item"
            >
                <BiPlus />
            </Link>
        </div>
    );
}
