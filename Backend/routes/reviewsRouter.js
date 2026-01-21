import express from "express";
import { createReview, getReviews, approveReview, deleteReview } from "../controllers/reviewsController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", requireAuth, createReview);
reviewRouter.get("/", getReviews);
reviewRouter.put("/:reviewID/approve", requireAdmin, approveReview);
reviewRouter.delete("/:reviewID", requireAdmin, deleteReview);

export default reviewRouter;
