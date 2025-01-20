import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductContent from '../components/CreateProductContent';
import Productlist from '../components/Productlist';
import AnalyticsContent from '../components/AnalyticsContent';
import { useProductStore } from '../stores/useProductStore';
import { useEffect } from 'react';

const tabs = [
    { id: 'create', label: 'Create Product', icon: PlusCircle },
    { id: 'products', label: 'Products', icon: ShoppingBasket },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const {fetchAllProducts} = useProductStore();
    useEffect(() => {
        fetchAllProducts();
    },[fetchAllProducts]);

    return (
        <div className='relative min-h-screen bg-origin-border text-white overflow-hidden '>
            <div className='relative px-4 pt-4 '>
                <motion.h1
                    className='text-4xl font-bold text text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                </motion.h1>
                <div className='flex justify-center mb-2'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <tab.icon className='mr-2 h-5 w-5' />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Render content based on the active tab */}
                {activeTab === 'create' && <CreateProductContent />}
                {activeTab === 'products' && <Productlist />}
                {activeTab === 'analytics' && <AnalyticsContent />}
            </div>
        </div>
    );
};

export default AdminPage;
