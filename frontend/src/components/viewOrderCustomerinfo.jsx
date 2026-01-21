import { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function ViewOrderCustomerInfoCustomer({ order }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        try {
            Modal.setAppElement("#root");
        } catch (e) {}
    }, []);

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel={order ? `Order ${order.orderID}` : "Order Details"}
                overlayClassName="fixed inset-0 bg-black/40 flex items-start md:items-center justify-center p-4 z-50"
                className="bg-white rounded-lg max-w-2xl w-full shadow-lg outline-none"
            >
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Order Details {order ? `- #${order.orderID}` : ""}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            Close
                        </button>
                    </div>

                    {order ? (
                        <div className="mt-4 text-sm text-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><strong>Name:</strong> {order.name ?? "—"}</div>
                                <div><strong>Email:</strong> {order.email ?? "—"}</div>
                                <div><strong>Phone:</strong> {order.phonenumber ?? "—"}</div>
                                <div>
                                    <strong>Date:</strong>{" "}
                                    {order.date ? new Date(order.date).toLocaleString() : "—"}
                                </div>
                                <div className="md:col-span-2">
                                    <strong>Address:</strong> {order.address ?? "—"}
                                </div>

                                <div className="md:col-span-2">
                                    <strong>Note:</strong>
                                    <p className="mt-1 p-2 bg-slate-50 rounded-md">
                                        {order.notes ?? "No notes"}
                                    </p>
                                </div>

                                <div>
                                    <strong>Status:</strong>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ml-2
                                            ${
                                                order.status === "Delivered"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : order.status === "Shipped"
                                                    ? "bg-yellow-100 text-amber-800"
                                                    : "bg-indigo-100 text-indigo-800"
                                            }`}
                                    >
                                        {order.status ?? "Pending"}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <strong>Total:</strong> ${order.total ?? "0.00"}
                                </div>
                            </div>

                            <div className="mt-4">
                                <strong className="block mb-2">Items</strong>
                                <div className="w-full overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b text-left">
                                            <tr>
                                                <th className="py-2">SKU</th>
                                                <th className="py-2">Name</th>
                                                <th className="py-2 text-right">Unit</th>
                                                <th className="py-2 text-right">Qty</th>
                                                <th className="py-2 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(order.items || []).map((it, idx) => {
                                                const qty = Number(it.quantity ?? 1);
                                                const unit = Number(it.price ?? 0);
                                                return (
                                                    <tr key={idx} className="border-b">
                                                        <td className="py-2">{it.productID ?? "-"}</td>
                                                        <td className="py-2">{it.name ?? "Item"}</td>
                                                        <td className="py-2 text-right">${unit.toFixed(2)}</td>
                                                        <td className="py-2 text-right">{qty}</td>
                                                        <td className="py-2 text-right">
                                                            ${(unit * qty).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-slate-600">Order not available</p>
                    )}
                </div>
            </Modal>

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
                View Order
            </button>
        </>
    );
}
