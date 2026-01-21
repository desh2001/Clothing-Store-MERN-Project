import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import axios from "axios";

/* ✅ Set app element ONCE (safe for Vite) */
try {
    Modal.setAppElement("#root");
} catch (e) {}

export default function ViewOrderInfo(props) {
    const { order, onStatusChange } = props || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState(order?.status || "Pending");
    const [note, setNote] = useState(order?.notes || "");
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Get user role from localStorage or API
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setIsAdmin(user?.role === "admin");
            } catch (e) {
                console.error("Failed to parse user:", e);
            }
        } else {
            // Fallback: fetch from API
            const token = localStorage.getItem("token");
            if (token) {
                axios.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    setIsAdmin(res.data?.role === "admin");
                    localStorage.setItem("user", JSON.stringify(res.data));
                })
                .catch(() => setIsAdmin(false));
            }
        }
    }, []);

    /* ✅ Sync values when modal opens */
    useEffect(() => {
        if (isModalOpen && order) {
            setStatus(order.status || "Pending");
            setNote(order.notes || "");
        }
    }, [isModalOpen, order]);

    return (
        <>
            {/* ================= MODAL ================= */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Order details"
                overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50"
                className="bg-white rounded-lg max-w-2xl w-full shadow-lg outline-none"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Order Details {order?.orderID && `- #${order.orderID}`}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            Close
                        </button>
                    </div>

                    {!order ? (
                        <p className="mt-4 text-slate-600">
                            Order information not available.
                        </p>
                    ) : (
                        <div className="mt-4 text-sm text-slate-700 space-y-4">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><strong>Customer:</strong> {order.name || "—"}</div>
                                <div><strong>Email:</strong> {order.email || "—"}</div>
                                <div><strong>Phone:</strong> {order.phonenumber || order.phoneNumber || "—"}</div>
                                <div><strong>Date:</strong> {order.date ? new Date(order.date).toLocaleString() : "—"}</div>
                                <div className="md:col-span-2">
                                    <strong>Address:</strong> {order.address || "—"}
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-2">
                                    <strong>Note:</strong>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        disabled={!isAdmin}
                                        rows={3}
                                        className={`w-full mt-1 p-2 border rounded-md bg-slate-50 ${!isAdmin ? "opacity-60 cursor-not-allowed" : ""}`}
                                    />
                                    {!isAdmin && <p className="text-xs text-slate-500 mt-1">Only admins can edit notes</p>}
                                </div>

                                {/* Status */}
                                <div>
                                    <strong>Status:</strong>
                                    <span
                                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                            status === "Delivered"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : status === "Shipped"
                                                ? "bg-yellow-100 text-amber-800"
                                                : "bg-indigo-100 text-indigo-800"
                                        }`}
                                    >
                                        {status}
                                    </span>

                                    {isAdmin && (
                                        <select
                                            value={status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setStatus(newStatus);
                                                if (typeof onStatusChange === "function" && order?.orderID) {
                                                    onStatusChange(order.orderID, newStatus);
                                                }
                                            }}
                                            className="ml-3 border rounded px-2 py-1 text-sm"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    )}
                                    {!isAdmin && <p className="text-xs text-slate-500 mt-1">Only admins can change status</p>}
                                </div>

                                <div className="text-right">
                                    <strong>Total:</strong> ${order.total || "0.00"}
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <strong className="block mb-2">Items</strong>
                                <div className="overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b text-slate-600">
                                            <tr>
                                                <th className="py-2 text-left">SKU</th>
                                                <th className="py-2 text-left">Name</th>
                                                <th className="py-2 text-right">Unit</th>
                                                <th className="py-2 text-right">Qty</th>
                                                <th className="py-2 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(order.items || []).map((it, idx) => {
                                                const qty = Number(it.quantity || 1);
                                                const unit = Number(it.price || 0);
                                                return (
                                                    <tr key={idx} className="border-b">
                                                        <td>{it.productID || "-"}</td>
                                                        <td>{it.name || "Item"}</td>
                                                        <td className="text-right">${unit.toFixed(2)}</td>
                                                        <td className="text-right">{qty}</td>
                                                        <td className="text-right">
                                                            ${(unit * qty).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Save Button */}
                            {isAdmin && (order.notes !== note || order.status !== status) && (
                                <button
                                    onClick={() => {
                                        const token = localStorage.getItem("token");
                                        axios
                                            .put(
                                                import.meta.env.VITE_BACKEND_URL + `/orders/${order.orderID}`,
                                                { status, notes: note },
                                                { headers: { Authorization: `Bearer ${token}` } }
                                            )
                                            .then(() => {
                                                toast.success("Order updated successfully");
                                                setIsModalOpen(false);
                                                window.location.reload();
                                            })
                                            .catch(() => {
                                                toast.error("Failed to update order");
                                            });
                                    }}
                                    className="bg-accent/70 hover:bg-accent text-white px-4 py-2 rounded-md"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {/* ================= OPEN BUTTON ================= */}
            <button
                onClick={() => {
                    if (!order?.orderID) {
                        toast.error("Order ID not available");
                        return;
                    }
                    setIsModalOpen(true);
                }}
                className="bg-accent/70 hover:bg-accent p-2 rounded-2xl text-white"
            >
                View Order Info
            </button>
        </>
    );
}
