import { useEffect } from 'react';
import CategoryItem from '../components/CategoryItem';
import FeaturedProducts from '../components/FeaturedProducts'; // Importing FeaturedProducts
import { useProductStore } from '../stores/useProductStore';

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "./jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoe", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
  { href: "/jacket", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  const {fetchFeaturedProducts, products, isloading } = useProductStore();
  
  const featuredProducts = Array.isArray(products)
    ? products.filter((product) => product.isFeatured)
    : [];
  useEffect(() => {
    fetchFeaturedProducts()
  }, [products,fetchFeaturedProducts]);

  // Lọc sản phẩm có isFeatured === true

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h2 className='text-center text-5xl sm:text-6xl font-bold text-black mb-4'>
          Explore Our Categories
        </h2>
        <p className='text-center text-xl text-gray-300 mb-12'>
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem
              category={category}
              key={category.name}
            />
          ))}
        </div>
      </div>
      {!isloading && <FeaturedProducts featuredProducts={featuredProducts}></FeaturedProducts>}
    </div>
  );
};

export default HomePage;
