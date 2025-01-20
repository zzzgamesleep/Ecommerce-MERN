import Coupon from "../model/Coupon.model.js";
import { stripe } from "../lib/stripe.js";
import Order from "../model/Order.model.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array " });
        }
        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: amount
                },
                quantity: product.quantity || 1,
            };
        });
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ?
                [
                    {
                        coupon: await createStripeCoupon(coupon.discountPercentage),
                    }
                ] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });
        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }
        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

    } catch (error) {
        console.log("Error processing checkout", error.message);
        res.status(500).json({ message: "Server Error" }, error.message);
    }
};
export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // Kiểm tra nếu Order đã tồn tại
            const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
            if (existingOrder) {
                console.log("Order already exists");
                return res.status(200).json({
                    success: true,
                    message: "Order already processed.",
                    orderId: existingOrder._id,
                });
            }

            // Xử lý Coupon nếu có
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                }, { isActive: false });
            }

            // Lưu Order mới
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // convert từ cent sang dollars
                stripeSessionId: sessionId
            });
            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment success, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        }
    } catch (error) {
        console.log("Error processing payment", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })
    return coupon.id;
}
async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 24 * 1000 * 60),
        userId: userId,
    })
    await newCoupon.save();
}