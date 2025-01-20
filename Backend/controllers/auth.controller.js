import { json } from "express";
import User from "../model/User.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

// Generate access and refresh tokens
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days 
};

// Set access and refresh tokens as cookies
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attack
        maxAge: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// Signup route handler
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, name });
        //authenticate
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login route handler (placeholder)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(401).json({ message: "Invalid password or email was wrong" })
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: error.message });
    }
};

// Logout route handler
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshToken:${decoded.userId}`); // Matching key format
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided " })
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token " })
        }
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // prevent XSS attack
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // prevent CSRF attack
            maxAge: 15 * 60 * 1000,
        });
        res.status(400).json({ message: "Refresh Token Successfully" });

    } catch (error) {
        console.log("Error in refresh Token controller", error.message);
        res.status(500).json({ message: "Server Error" }, error.message);
    }

};
export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" }, error.message);
    }
}