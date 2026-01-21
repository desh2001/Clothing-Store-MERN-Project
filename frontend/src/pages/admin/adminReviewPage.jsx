import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!loaded) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/reviews/", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setReviews(res.data);
                    setLoaded(true);
                })
                .catch((err) => {
                    console.error("Error fetching reviews:", err);
                    toast.error("Failed to load reviews");
                });
        }
    }, [loaded]);

    const approve = async (reviewID) => {
        const token = localStorage.getItem("token");
        setBusyId(reviewID);
        try {
            await axios.put(
                import.meta.env.VITE_BACKEND_URL + `/reviews/${reviewID}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviews((prev) =>
                prev.map((r) => (r.reviewID === reviewID ? { ...r, isApproved: true } : r))
            );
            toast.success(`Review ${reviewID} approved`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to approve review");
        } finally {
            setBusyId(null);
        }
    };

    const reject = async (reviewID) => {
        const token = localStorage.getItem("token");
        setBusyId(reviewID);
        try {
            await axios.delete(
                import.meta.env.VITE_BACKEND_URL + `/reviews/${reviewID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviews((prev) => prev.filter((r) => r.reviewID !== reviewID));
            toast.success(`Review ${reviewID} deleted`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete review");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="w-full p-8 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-auto mx-auto max-w-6xl w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Reviews</h2>
                        <p className="text-sm text-slate-500">Approve or reject customer reviews.</p>
                    </div>
                    <div className="text-sm text-slate-600">
                        Total: <span className="font-medium">{reviews.length}</span>
                    </div>
                </div>

                {loaded ? (
                    <table className="min-w-full table-auto">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">Reviewer</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Comment</th>
                                <th className="px-4 py-3 text-center">Rating</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                                <th className="px-4 py-3 text-center">Approved</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((r) => (
                                <tr
                                    key={r.reviewID}
                                    className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <td className="px-4 py-4 text-sm">
                                        <div className="font-medium text-slate-800">{r.name}</div>
                                        <div className="text-xs text-slate-500">#{r.reviewID}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm">{r.title || "—"}</td>
                                    <td className="px-4 py-4 text-sm max-w-md truncate" title={r.comment}>{r.comment}</td>
                                    <td className="px-4 py-4 text-center">{r.rating}</td>
                                    <td className="px-4 py-4 text-sm hidden md:table-cell">{new Date(r.date).toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 text-sm rounded-full ${r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                                            {r.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center space-x-2">
                                        <button
                                            disabled={busyId === r.reviewID || r.isApproved}
                                            onClick={() => approve(r.reviewID)}
                                            className={`px-3 py-1 rounded-md text-white text-sm ${r.isApproved ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            disabled={busyId === r.reviewID}
                                            onClick={() => reject(r.reviewID)}
                                            className="px-3 py-1 rounded-md text-white text-sm bg-red-600 hover:bg-red-700"
                                        >
                                            Reject
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
        </div>
    );
}
