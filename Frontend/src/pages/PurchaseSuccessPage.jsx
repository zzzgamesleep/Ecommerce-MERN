import { ArrowRightIcon, CheckCircle, HandHeartIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore';
import axios from '../lib/axios';
import Confetti from 'react-confetti'
const PurchaseSuccessPage = () => {
    const [ isProcessing, setIsProcessing]  = useState(true);
    const { clearCart } = useCartStore();
    const [error, setError] = useState(null);
    useEffect(() => {
        const handleCheckoutSession = async (sessionId) => {
            try {
                await axios.post("/payments/checkout-success", {
                    sessionId,
                });
                clearCart();
            } catch (error) {
                console.error(error);
            } finally {
                setIsProcessing(false);
            }
        };

        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
            handleCheckoutSession(sessionId);
        } else {
            setIsProcessing(false);
            setError("No session ID found in the URL");
        }
    }, [clearCart]);

    if (isProcessing) return "Processing ...";
    if (error) return `Error: ${error}`;
    return (
        <div className='h-screen flex items-center justify-center px-4'>
            <Confetti
                width={
                    window.innerWidth
                }
                height={
                    window.innerHeight
                }
                gravity={0.1}
                style={{zIndex:99}}
                numberOfPieces={700}
                recycle={false}
            >

            </Confetti>
            <div className="max-w-lg bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative z-10 p-6">
                <div className="flex justify-center mb-6">
                    <CheckCircle className='text-emerald-400 w-20 h-20' />
                </div>
                <h1 className='text-3xl font-extrabold text-center text-emerald-400 mb-4'>
                    Purchase Successful
                </h1>
                <p className='text-gray-300 text-center mb-4 text-lg'>
                    Thank you for your order. {"We're"} processing it now.
                </p>
                <p className='text-emerald-400 text-center text-sm mb-8'>
                    We appreciate your trust in us!
                </p>
                <div className='bg-gray-700 rounded-lg p-5 mb-8'>
                    <div className='flex items-center justify-between mb-3'>
                        <span className='text-sm text-gray-400'>Order Number</span>
                        <span className='text-lg font-semibold text-emerald-400'>#12345</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-400'>Estimated Delivery</span>
                        <span className='text-lg font-semibold text-emerald-400'>3-5 business days</span>
                    </div>
                </div>
                <div className='space-y-5'>
                    <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg'>
                        <HandHeartIcon className='mr-3 w-5 h-5' />
                        Thanks for trusting us!
                    </button>
                    <Link className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold 
                    py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg' to={"/"}>
                        Continue Shopping
                        <ArrowRightIcon className='ml-3 w-5 h-5' />
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default PurchaseSuccessPage