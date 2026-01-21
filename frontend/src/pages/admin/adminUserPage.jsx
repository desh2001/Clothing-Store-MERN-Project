import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/users/all" , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => {
                    setUsers(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                    toast.error("Failed to load users");
                });
        }
    }, [loaded]);

    return (
        <div className="w-full p-8 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-auto mx-auto max-w-6xl">
                {loaded ? (
                    <table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-2xl bg-white/70">
                        <thead className="bg-accent text-white sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-center">Image</th>
                                <th className="px-4 py-3 text-center">Email</th>
                                <th className="px-4 py-3 text-center">First Name</th>
                                <th className="px-4 py-3 text-center">Last Name</th>
                                <th className="px-4 py-3 text-center">Role</th>
                                <th className="px-4 py-3 text-center">status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.userID}
                                    className="odd:bg-slate-50 even:bg-white hover:bg-slate-100"
                                >
                                    <td className="px-4 py-3 flex items-center justify-center">
                                        <img
                                            src={u.image}
                                            alt={u.firstName}
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">{u.email} {<u className="isVerified">{u.isEmailVerified ? "✔️" : "❌"}</u>}       </td>
                                    <td className="px-4 py-3 text-center">{u.firstName}</td>
                                    <td className="px-4 py-3 text-center">{u.lastName}</td>
                                    <td className="px-4 py-3 text-center">{u.role}</td>
                                    <td className="px-4 py-3 text-center">{u.isBlocked ? "Blocked" : "Active"}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={async() => {
                                           
                                            axios.put(import.meta.env.VITE_BACKEND_URL + `/users/block/`, {
                                                email: u.email,
                                                isBlocked: !u.isBlocked
                                            }, {    
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                                }
                                            })
                                            .then(() => {
                                                setLoaded(false);
                                                toast.success("User status updated");
                                            })
                                            .catch((error) => {
                                                console.error("Error updating block status:", error);
                                                toast.error("Failed to update block status");
                                            });
                                        }}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                            {
                                                u.isBlocked ? "Unblock" : "Block"
                                            }
                                            </button>
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
