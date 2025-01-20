import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: ""
    });
   const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price') {
            let numericValue = value
                .replace(/[^0-9.-]/g, '') // Chỉ cho phép số, dấu chấm thập phân, và dấu trừ
                .replace(/(^[0-9]+\..*)\./g, '\$1'); // Chỉ cho phép một dấu chấm thập phân

            // Loại bỏ dấu trừ nếu nó không ở đầu chuỗi
            if (numericValue.indexOf('-') !== 0) {
                numericValue = numericValue.replace('-', '');
            }

            // Loại bỏ dấu cộng nếu nó ở bất kỳ vị trí nào
            numericValue = numericValue.replace('+', '');

            // Giữ nguyên giá trị số khi người dùng nhập ký tự không hợp lệ
            if (numericValue === '' || isNaN(parseFloat(numericValue))) {
                numericValue = newProduct.price;
            }

            setNewProduct({
                ...newProduct,
                [name]: numericValue
            });
        } else {
            setNewProduct({
                ...newProduct,
                [name]: value
            });
        }
    };
    const {createProduct , loading} = useProductStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(newProduct);
            setNewProduct({name: "", description: "", price: "", category: "", image: ""});
        } catch (error) {
            console.log("error creating product")
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Sử dụng thuộc tính files thay vì file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-blue-300'>Create New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='mb-4'>
                    <label className='block text-gray-200 mb-2' htmlFor='name'>Product Name</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg text-gray-800'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-200 mb-2' htmlFor='description'>Description</label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        rows={3}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg text-gray-800'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-200 mb-2' htmlFor='price'>Price</label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        step={0.01}
                        min="0"
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg text-gray-800'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-200 mb-2' htmlFor='category'>Category</label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg text-gray-800'
                        required
                    >
                        <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-200 mb-2' htmlFor='image'>Image URL</label>
                    <input
                        type='file'
                        id='image'
                        name='image'
                        className='sr-only'
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        Upload Image
                    </label>
                    {newProduct.image && < span className='ml-3 text-sm text-gray-400'>Image Uploaded</span>}
            </div>
            <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent
           rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
           hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50'
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                        Loading...
                    </>
                ) : (
                    <>
                        <PlusCircle className='mr-2 h-5 w-5' aria-hidden='true' />
                        Create Product
                    </>
                )}
            </button>
        </form>
        </motion.div >
    );
};

export default CreateProductForm;
