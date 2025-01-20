import express from "express";
import {
    getAllProducts,
    getFeaturedProduct,
    createProduct,
    deleteProduct,
    getRecommentProducts,
    getProductCategory,
    toggleFeaturedProduct
} from "../controllers/product.controller.js";
import { protectRoute, Adminroute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllProducts);
router.get("/featured", getFeaturedProduct);
router.get("/category/:category", getProductCategory);
router.get("/recommendations", getRecommentProducts);
router.post("/", protectRoute, Adminroute, createProduct);
router.patch("/:id", protectRoute, Adminroute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, Adminroute, deleteProduct);



export default router;
