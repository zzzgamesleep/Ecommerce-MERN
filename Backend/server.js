import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth.route.js";
import productRoutes from "./Routes/product.Routes.js";
import cartRoutes from "./Routes/cart.route.js";
import couponRoutes from "./Routes/coupon.route.js";
import paymentRoutes from "./Routes/payment.route.js";
import { connectDB } from "./lib/db.js";
import analyticsRoutes from "./Routes/analytics.routes.js"
dotenv.config();

const app = express();  
const PORT = process.env.PORT || 5001;

//authencation
app.use(express.json({ limit: "10mb" })); //allow you to parse the body of request 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);


app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();
})