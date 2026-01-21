import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";


dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "pasindu.udana.mendis@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD
    }});

export async function createUser(req, res) {
    try {
        const data = req.body;

        // check if email exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const user = new User({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
            role: data.role,
        });

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// =====================
// LOGIN USER
// =====================
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(user.isBlocked){
            return  res.status(403).json({ message: "Your account has been blocked. Please contact support." });
                  
        }   

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
        };


        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        res.json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// =====================
// GET CURRENT USER
// =====================
export async function getCurrentUser(req, res) {
    try {
        // `verifyToken` middleware attaches `req.user` when a valid token is provided
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// =====================
// ADMIN CHECK (MIDDLEWARE)
// =====================
export function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Access denied" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    next();
}

export async function googleLogin(req, res) {
    try {
        // Get access token from frontend
        const accessToken = req.body.access_token;

        if (!accessToken) {
            return res.status(400).json({ message: "Token missing" });
        }

        // Fetch Google user info
        const googleResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = googleResponse.data;

        // Extract names safely (Google may not provide family_name)
        const firstName =
            data.given_name ||
            data.name?.split(" ")[0] ||
            "Unknown";

        const lastName =
            data.family_name ||
            data.name?.split(" ")[1] ||
            "NA"; // fallback to avoid validation error

        const email = data.email;
        const image = data.picture;

        // Check if user exists
        let user = await User.findOne({ email });

        // If not found → create new user
        if (!user) {
            user = new User({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: "123",   // You can hash this later
                image: image,
                isEmailVerified: true,
                isBlocked: false,
            });

            await user.save();
        }

        // JWT payload
        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: true,
            image: user.image,
            isBlocked: user.isBlocked
        };
        if(user.isBlocked){
            return  res.status(403).json({ message: "Your account has been blocked. Please contact support." });
        }

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "150h",
        });

        // Successful response
        res.json({
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

export async function validateOTPAndUpdatePassword  (req, res) {

    try{
    const otpCode = req.body.otp;
    const newPassword = req.body.newPassword;
    const email = req.body.email;

    const otp = await Otp.findOne({ email: email, otp: otpCode });
    if (!otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    await User.updateOne({email:email},{
        $set : {password: hashedPassword , isEmailVerified : true}
    });
    res.json({
        message: "Password updated successfully"})
        }catch(err){
            res.status(500).json({
                message: "failed to update",
                error: err.message,})
}
}


export async function sendOTP(req, res) {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove old OTPs for the user
    await Otp.deleteMany({ email: email });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    const otpEntry = new Otp({
      email: email,
      otp: otpCode
    });
    await otpEntry.save();

    // HTML email design
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a73e8; text-align: center;">Your OTP Code</h2>
        <p>Hello ${user.firstName || ""},</p>
        <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 10px 20px; background-color: #f0f4ff; border-radius: 8px; color: #1a73e8;">
            ${otpCode}
          </span>
        </div>
        <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #777;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    // Send email
    transporter.sendMail(
      {
        from: "pasindu.udana.mendis@gmail.com",
        to: email,
        subject: "Your OTP Code for Password Reset",
        html: htmlMessage
      },
      (err, info) => {
        if (err) {
          console.error("Error sending OTP email:", err);
          res.status(500).json({
            message: "Failed to send OTP",
            error: err.message
          });
        } else {
          res.json({ message: "OTP sent successfully" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}


export async function getAllUsers(req, res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function changeBlockStatus(req, res) {

    try{
    const email = req.body.email;
    const isBlocked = req.body.isBlocked;
    if(req.user.email === email){
        return res.status(400).json({ message: "You cannot block/unblock yourself" });

    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    await User.updateOne({email:email},{
        $set : {isBlocked : isBlocked}
    });
    res.json({
        message: "User block status updated successfully"})
        }catch(err){
            res.status(500).json({
                message: "failed to update",
                error: err.message,})
}

}

export async function sendMail(req, res) {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        const mailOptions = {
            from: `"${firstName} ${lastName}" <${email}>`, // shows sender name
            to: "pasindu.udana.mendis@gmail.com",         // your Gmail
            subject: "New Contact Form Submission",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #1a73e8;">New Message from Contact Form</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                    <p><strong>Message:</strong></p>
                    <p style="padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
                        ${message}
                    </p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">This message was sent from your website contact form.</p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Mail sending error:", err);
                return res.status(500).json({
                    message: "Failed to send mail",
                    error: err.message
                });
            }

            res.json({ message: "Mail sent successfully" });
        });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}
