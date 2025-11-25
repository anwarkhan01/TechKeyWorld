import express from "express";
import {
    importProducts,
    getFilterProducts,
    getproducts,
    getRandomProducts,
    getProductsById,
    searchProducts
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/import-products", importProducts)
router.get("/get-products", getproducts)
router.get("/get-random-products", getRandomProducts)
router.get("/filter", getFilterProducts)
router.post("/get-products-by-ids", getProductsById);
router.get("/search", searchProducts);
export default router;