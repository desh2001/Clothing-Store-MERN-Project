import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"
import cors from "cors"
import errorHandler from "./middleware/errorHandler.js"
import orderRouter from "./routes/orderRouter.js"
import reviewRouter from "./routes/reviewsRouter.js"


const mongoURI = process.env.MONGO_URL
const PORT = process.env.PORT || 4900;

mongoose.connect(mongoURI).then(
    () => {
        console.log("Connected to MongoDB Cluster")
    }
)


const app = express()

app.use(cors())


app.use(express.json())


app.use(
    // attach user to req if a valid Bearer token is present
    (req, res, next) => {
        const authorizationHeader = req.header("Authorization");

        if (!authorizationHeader) return next();

        const token = authorizationHeader.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET, (error, content) => {
            if (error || !content) {
                // invalid token — do not block here, just continue without user
                console.log("invalid token");
                return next();
            }

            req.user = content;
            next();
        });
    }
)



app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/reviews", reviewRouter)



// Centralized error handler
app.use(errorHandler)


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});