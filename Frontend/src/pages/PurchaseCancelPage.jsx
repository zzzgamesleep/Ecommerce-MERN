import { XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PurchaseCancelPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10"
            >
                <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <XCircle className="text-red-500 w-16 h-16 mb-4" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2">
                        Purchase Cancelled
                    </h1>

                    {/* Message */}
                    <p className="text-gray-300 text-center mb-6">
                        Your order has been cancelled. No charges have been made.
                    </p>

                    {/* Support Info */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-400 text-center">
                            If you encountered any issues during the checkout process, please don't hesitate to contact our support team.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Link
                            to="/contact-support"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg"
                        >
                            Contact Support
                        </Link>
                        <Link
                            to="/"
                            className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg"
                        >
                            Return to Home
                            <ArrowRight className="ml-3 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PurchaseCancelPage;
