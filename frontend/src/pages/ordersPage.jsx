import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import ViewOrderCustomerInfo from "../components/viewOrderinfo";


export default function OrderPage() {
    const [orders,setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const token =localStorage.getItem("token");

        if (!loaded) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/orders/", {
                headers: {
                    Authorization: `Bearer ${token}`        }
          }  )
                .then((response) => {
                    setOrders(response.data);
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
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Orders</h2>
                        <p className="text-sm text-slate-500">Manage recent orders and update status quickly.</p>
                    </div>
                    <div className="text-sm text-slate-600">Total: <span className="font-medium">{orders.length}</span></div>
                </div>

                {loaded ? (
                    <table className="min-w-full table-auto">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((p) => (
                                <tr
                                    key={p.orderID}
                                    className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <td className="px-4 py-4 text-sm">
                                        <div className="font-medium text-slate-800">#{p.orderID}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-sm">{p.items?.length ?? 0} items</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <div className="text-slate-800">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.email}</div>
                                        {p.notes ? (
                                            <div className="text-xs text-rose-600 truncate max-w-sm mt-1">Note: {p.notes}</div>
                                        ) : null}
                                    </td>
                                    <td className="px-4 py-4 text-sm hidden md:table-cell">{new Date(p.date).toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm rounded-full ${p.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : p.status === 'Shipped' ? 'bg-yellow-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                            {p.status ?? 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium">${p.total}</td>
                                    <td className="px-4 py-4 text-center">
                                        <ViewOrderCustomerInfo order={p} />
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
