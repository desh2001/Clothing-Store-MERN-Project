import Review from "../models/Review.js";

export async function createReview(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const { rating, title, comment, name } = req.body;

    if (rating == null || Number.isNaN(Number(rating))) {
        return res.status(400).json({ message: "rating is required" });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: "rating must be between 1 and 5" });
    }

    if (!comment) {
        return res.status(400).json({ message: "comment is required" });
    }

    try {
     
        const latestReview = await Review.findOne().sort({ date: -1 });

        let reviewID = "REV000001";
        if (latestReview && latestReview.reviewID) {
            const latestNumber = parseInt(latestReview.reviewID.replace("REV", "")) || 0;
            const nextNumber = latestNumber + 1;
            reviewID = "REV" + nextNumber.toString().padStart(6, "0");
        }

        const reviewerName = (name ?? `${req.user.firstName ?? ""} ${req.user.lastName ?? ""}`).trim() || "Anonymous";

        const newReview = new Review({
            reviewID,
            name: reviewerName,
            rating: numericRating,
            title: title ?? "",
            comment,
            isApproved: false
        });

        await newReview.save();

        return res.status(201).json({
            message: "Review submitted successfully",
            reviewID
          
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function getReviews(req, res) {
    try {
        const isAdmin = req.user?.role === "admin";
        const filter = isAdmin ? {} : { isApproved: true };
        const reviews = await Review.find(filter).sort({ date: -1 });
        return res.json(reviews);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function approveReview(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    const { reviewID } = req.params;
    if (!reviewID) {
        return res.status(400).json({ message: "reviewID is required" });
    }

    try {
        const result = await Review.updateOne(
            { reviewID },
            { $set: { isApproved: true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.json({ message: "Review approved" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function deleteReview(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    const { reviewID } = req.params;
    if (!reviewID) {
        return res.status(400).json({ message: "reviewID is required" });
    }

    try {
        const result = await Review.deleteOne({ reviewID });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.json({ message: "Review deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}