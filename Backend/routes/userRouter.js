import express from "express"
import { changeBlockStatus, createUser, getAllUsers, googleLogin, loginUser, sendMail, sendOTP, validateOTPAndUpdatePassword } from "../controllers/userController.js"
import { getCurrentUser } from "../controllers/userController.js"
import { verifyToken, requireAuth } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)

// GET current authenticated user
userRouter.get("/", verifyToken, (req, res) => {
	// If a valid token is present, `req.user` will be set by verifyToken.
	if (!req.user) return res.status(401).json({ message: "Authentication required" });
	return res.json(req.user);
})

userRouter.post("/googlelogin",googleLogin)
userRouter.post("/send-otp/:email", sendOTP)
userRouter.post("/validate-otp" , validateOTPAndUpdatePassword)
userRouter.get("/all", verifyToken, getAllUsers)
userRouter.put("/block", verifyToken, changeBlockStatus)
userRouter.post("/sendmail/", sendMail)


export default userRouter