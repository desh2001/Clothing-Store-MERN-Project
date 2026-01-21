import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineExclamationCircle } from "react-icons/ai"

export default function ProductDeleteButton(props) {
        const productID = props.productID;
        const onDeleted = props.onDeleted; // optional callback to notify parent
        const [isMessageOpen , setisMessageOpen] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);

        function openConfirm() {
            setisMessageOpen(true);
        }

        async function confirmDelete() {
            setIsDeleting(true);
            const token = localStorage.getItem("token");
            try {
                await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/products/${productID}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Product deleted successfully");
                setisMessageOpen(false);
                if (typeof onDeleted === "function") onDeleted(productID);
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error(error?.response?.data?.message || "Failed to delete product");
            } finally {
                setIsDeleting(false);
            }
        }

        return (
            <>
                <button
                    onClick={openConfirm}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Delete
                </button>

                {isMessageOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
                        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 relative">
                            <button
                                onClick={() => setisMessageOpen(false)}
                                aria-label="Close"
                                className="absolute -right-4 -top-4 w-10 h-10 flex items-center justify-center bg-white text-red-600 rounded-full shadow"
                            >
                                ✕
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="text-red-600 text-4xl">
                                    <AiOutlineExclamationCircle />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold mb-2">Confirm delete</h1>
                                    <p className="text-sm text-slate-600">Are you sure you want to delete product <span className="font-medium">{productID}</span>? This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setisMessageOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 flex items-center gap-2"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }