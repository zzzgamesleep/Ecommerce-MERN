import { ShoppingCart } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore.js' 
const ProductCart = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } =  useCartStore();
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add product", { id: "login" });
            return;
        } else {
            addToCart(product);
        }
        console.log("san pham:", product);
    }
    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-300 shadow-lg bg-white text-black'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                <img src={product.image} alt="product image" className='object-cover w-full' />
                
                <img className='absolute inset-0 bg-white bg-opacity-20' />
            </div>
            <div className='mt-4 px-5 pb-5 bg-slate-200'>
                <h5 className='text-xl font-semibold tracking-tight text-black'>{product.name}</h5>
                
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-gray-900'>${product.price}</span>
                    </p>
                </div>
                <button
                    className='flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-gray-300'
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                </button>
            </div>
        </div>

    )
}

export default ProductCart