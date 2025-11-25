import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";



const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const cart = await Cart.findOne({ userId }).lean();

    return res.json(
        new ApiResponse(200, "Cart fetched successfully", cart || { items: [] })
    );
});

const updateCart = asyncHandler(async (req, res, next) => {
    const userId = req.user.uid;
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
        return next(new ApiError(400, "Cart must be an array"));
    }

    const items = cart
        .filter((i) => i.id && i.quantity && Number(i.quantity) > 0)
        .map((i) => ({
            productId: String(i.id).trim(),
            quantity: Math.min(100, Math.max(1, parseInt(i.quantity))) // clamp between 1–100
        }));

    if (cart.length > 0 && items.length === 0) {
        return next(new ApiError(400, "Invalid cart items"));
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { items },
        { new: true, upsert: true }
    );

    return res.json(
        new ApiResponse(200, "Cart updated successfully", updatedCart)
    );
});

export { getCart, updateCart };