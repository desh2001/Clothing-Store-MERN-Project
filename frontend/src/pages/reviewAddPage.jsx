import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ReviewAddPage() {
	const [name, setName] = useState("");
	const [rating, setRating] = useState(5);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please log in to submit a review");
			navigate("/login");
			return;
		}

		if (!comment.trim()) {
			toast.error("Comment is required");
			return;
		}

		const numericRating = Number(rating);
		if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
			toast.error("Rating must be between 1 and 5");
			return;
		}

		setSubmitting(true);
		try {
			await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/reviews/",
				{
					name: name || undefined,
					rating: numericRating,
					title: title || undefined,
					comment: comment.trim(),
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Review submitted! Pending approval by admin.");
			setName("");
			setRating(5);
			setTitle("");
			setComment("");
			navigate("/");
		} catch (err) {
			console.error(err);
			const msg = err?.response?.data?.message || "Failed to submit review";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="w-full p-8 flex justify-center">
			<div className="bg-white shadow-lg rounded-lg mx-auto max-w-2xl w-full p-6">
				<h2 className="text-2xl font-semibold text-slate-800 mb-2">Submit a Review</h2>
				<p className="text-sm text-slate-500 mb-6">Share your experience with our store.</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Name (optional)</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Your name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
						<select
							value={rating}
							onChange={(e) => setRating(e.target.value)}
							className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{[1, 2, 3, 4, 5].map((r) => (
								<option key={r} value={r}>{r}</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Title (optional)</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="E.g., Great service!"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
						<textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={5}
							className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Write your review here..."
							required
						/>
					</div>

					<div className="flex justify-end gap-3">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="px-4 py-2 rounded-md border text-slate-700 hover:bg-slate-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className={`px-4 py-2 rounded-md text-white ${submitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
						>
							{submitting ? "Submitting..." : "Submit Review"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
