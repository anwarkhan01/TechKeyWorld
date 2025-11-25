import Order from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";

const createOrder = asyncHandler(async (req, res, next) => {
  const { uid, email } = req.user;
  console.log("controller called");
  // Generate unique orderId
  const orderId = [...crypto.getRandomValues(new Uint8Array(12))]
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 20)
    .toUpperCase();

  const user = await User.findOne({
    $or: [{ firebaseUid: uid }, { email }],
  });

  if (!user) return next(new ApiError(401, "Unauthorized"));

  const { productData, paymentMethod, meta } = req.body;

  console.log("productData", productData);
  // Validation
  if (!productData || !paymentMethod) {
    return next(
      new ApiError(400, "productData and paymentMethod are required")
    );
  }

  if (
    !Array.isArray(productData.products) ||
    productData.products.length === 0
  ) {
    return next(
      new ApiError(400, "Product data must contain at least one product")
    );
  }

  const validPaymentMethods = [
    "upi",
    "cc",
    "dc",
    "nb",
    "emi",
    "upi_p",
    "unknown",
  ];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return next(new ApiError(400, "Invalid payment method"));
  }

  // Fetch products from DB to enrich snapshot
  const productIds = productData.products.map((p) => p.product_id);
  const products = await Product.find({
    product_id: { $in: productIds },
  }).lean();

  const productMap = new Map(products.map((p) => [p.product_id, p]));

  const enrichedProducts = productData.products.map((item) => {
    const dbProd = productMap.get(item.product_id);
    if (!dbProd) {
      throw new ApiError(400, `Invalid product_id: ${item.product_id}`);
    }
    return {
      product_id: dbProd.product_id,
      product_name: dbProd.product_name,
      image_url: dbProd.image_url || null,
      platform: dbProd.platform || null,
      version: dbProd.version || null,
      price: dbProd.price,
      quantity: item.quantity,
    };
  });

  productData.products = enrichedProducts;

  // Create order
  const order = new Order({
    firebaseUid: uid,
    useremail: user.email,
    productData,
    paymentMethod,
    orderId,
    meta: meta || { createdAt: new Date(), fromBuyNow: false },
    status: "pending",
  });

  await order.save();

  return res.json(
    new ApiResponse(200, "Order placed successfully", {
      orderId: order.orderId,
    })
  );
});

const getOrders = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ firebaseUid: uid })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ firebaseUid: uid }),
  ]);

  return res.json(
    new ApiResponse(200, orders.length ? "Orders fetched" : "No orders", {
      count: orders.length,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const { uid } = req.user;
  const { orderId } = req.params;

  const order = await Order.findOne({ orderId, firebaseUid: uid }).lean();

  if (!order) {
    return next(new ApiError(404, "Order not found"));
  }

  return res.json(new ApiResponse(200, "Order fetched", order));
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { cancellation_reason } = req.body;

  if (!orderId) {
    return next(new ApiError(400, "orderId is required"));
  }

  const resp = await Order.findOneAndUpdate(
    { orderId, firebaseUid: req.user.uid },
    {
      $set: {
        status: "cancelled",
        "cancelled.isCancelled": true,
        "cancelled.cancellation_reason": cancellation_reason,
        "cancelled.cancelledAt": new Date(),
      },
    },
    { new: true }
  );

  if (!resp) {
    return next(new ApiError(404, "Order not found"));
  }

  res.json(new ApiResponse(200, "Order cancelled", resp));
});

export { createOrder, getOrders, getOrderById, cancelOrder };
