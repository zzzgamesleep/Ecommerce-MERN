import Stripe from "stripe";
import exprees from "express"
import dotenv from "dotenv";
dotenv.config();
const router = exprees.Router();
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default router; 