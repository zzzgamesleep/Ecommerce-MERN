import { motion } from 'framer-motion'
import React from 'react'
import { useCartStore } from '../stores/useCartStore';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from '../lib/axios';

const stripePromise = loadStripe("pk_test_51QJph9GIjxv6FCaHh5EhFh34JPE1TvVOcPeW2Zg63g4mke6u7dAxja6ztS2wAMEPiiH0ZH7sIKRZim6TL4AJcEmY00nKX1Snx4");
const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async () => {
        const stripe = await stripePromise;
        const res = await axios.post("/payments/create-checkout-session", {
            products: cart,
            couponCode: coupon ? coupon.code : null,
        });

        const session = res.data;
        console.log("session is here ", session);
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        })
        if (result.error) {
            console.error("error :", result.error);
        }
    };
    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className='text-xl font-semibold text-emerald-400'>Order summary</p>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <dl className='flex items-start justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300 '>Original Price</dt>
                        <dt className='text-base font-normal text-white'>${formattedSubtotal}</dt>
                    </dl>
                    {savings > 0 && (
                        <dl className='flex items-start justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300 '>savings</dt>
                            <dt className='text-base font-normal text-white'>-${formattedSavings}</dt>
                        </dl>
                    )}
                    {coupon && isCouponApplied && (
                        <dl className='flex items-start justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300 '>({coupon.code})</dt>
                            <dt className='text-base font-normal text-white'>-${coupon.discountPercentage}%</dt>
                        </dl>
                    )}
                    <dl className='flex items-start justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300 '>Total</dt>
                        <dt className='text-base font-normal text-white'>${formattedTotal}</dt>
                    </dl>
                </div>
                <motion.button
                    className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                >
                    Proceed to Checkout
                </motion.button>
                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>or</span>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-white underline hover:text-emerald-500 hover:underline'
                    >
                        Continue Shopping
                    </Link>
                    <MoveRight size={16} />
                </div>


            </div>

        </motion.div >
    );

}

export default OrderSummary