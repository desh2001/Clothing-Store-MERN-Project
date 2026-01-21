import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
   
    reviewID : {
        type: String,
        required: true,
        unique: true
    },  
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;