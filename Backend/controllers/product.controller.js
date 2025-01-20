import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../model/Product.model.js"
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });

    } catch (error) {
        console.log("Error in get Allproducts controller :", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getFeaturedProduct = async (req, res) => {
    try {
        // Kiểm tra Redis trước
        var featuredProducts = await redis.get("feature_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts)); // Nếu có dữ liệu trong Redis, trả về ngay
        }

        // Nếu không có dữ liệu trong Redis, fetch từ MongoDB
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        // Kiểm tra xem MongoDB có trả về dữ liệu không
        if (featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" }); // Trả về 404 khi không tìm thấy sản phẩm
        }

        // Lưu vào Redis để sử dụng lần sau
        await redis.set("feature_products", JSON.stringify(featuredProducts));

        // Trả về dữ liệu
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message }); // Trả về 500 khi có lỗi
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryReponse = null;
        if (image) {
            cloudinaryReponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }
        const products = await Product.create({
            name,
            description,
            price,
            image: cloudinaryReponse?.secure_url ? cloudinaryReponse.secure_url : "https://upload-request.cloudinary.com/dmmkhjchj/27a6bc43bf19ef64c76699ed19586d09",
            category,
        })
        res.status(201).json(products);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error" }, error.message);
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (products.image) {
            const publicId = products.image.split("/").pop().split(",")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error deleting image cloudinary", error);
            }
        }
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: "Product deleted successfully " })
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error" }, error.message);
    }
}
export const getRecommentProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([[
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ]])
        res.json(products)
    } catch (error) {
        console.log("Error in getRecommentProducts controller", error.message);
        res.status(500).json({ message: "Server error" }, error.message);
    }
}
export const getProductCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductCategory controller", error.message);
        res.status(500).json({ message: "Server error" }, error.message);
    }
}
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        if (products) {
            products.isFeatured = !products.isFeatured;
            const updateProduct = await products.save();
            await updateFeaturedProductCache();
            res.json(updateProduct);
        } else {
            res.status(404).json({ message: "Product not found" });

        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error" }, error.message);
    }
}
async function updateFeaturedProductCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()
        await redis.set("feature_products", JSON.stringify({ featuredProducts }))
    } catch (error) {
        console.log("Error in update cache function controller", error.message);
    }
}