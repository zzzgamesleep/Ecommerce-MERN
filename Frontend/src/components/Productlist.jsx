import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
    if (!products || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className="min-w-full divide-y divide-gray-700">
                <thead>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'>
                            Product
                        </th>
                        <th scope='col' className='px-6 py-3  text-xs font-medium text-gray-300 uppercase tracking-wider text-center'>
                            Price
                        </th>
                        <th scope='col' className='px-6 py-3  text-xs font-medium text-gray-300 uppercase tracking-wider text-center'>
                            Category
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'>
                            Featured
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center '>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {products.map((product) => (
                        <tr key={product._id} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap text-center align-middle'>
                                <div className='flex flex-col items-center'>
                                    <img
                                        className='h-10 w-10 rounded-full object-cover mb-2'
                                        src={product.image}
                                        alt={product.name}
                                    />
                                    <span className='text-sm font-medium text-white'>{product.name}</span>
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-center'>
                                <div className='text-sm text-gray-300'>
                                    ${product.price.toFixed(2)}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-center'>
                                <div className='text-sm text-gray-300'>
                                    {product.category}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-center'>
                                <div className='text-sm text-gray-300'>
                                    <button
                                        onClick={() => toggleFeaturedProduct(product._id)}
                                        className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                                            } hover:bg-yellow-500 transition-colors duration-200`}
                                    >
                                        <Star className='h-5 w-5' />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className='text-red-400 hover:text-red-300'
                                >
                                    <Trash className='h-5 w-5' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};

export default ProductsList;
