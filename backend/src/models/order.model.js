import mongoose from "mongoose";


const orderProductSchema = new mongoose.Schema(
    {
        product_id: { type: String, required: true },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        product_price: { type: Number, required: true, min: 0 },
        image_url: { type: String, default: null },
        platform: { type: String },
        version: { type: String },
    },
    { _id: false }
);

const pricingSchema = new mongoose.Schema(
    {
        // subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
        products: { type: [orderProductSchema], required: true },
    },
    { _id: false }
);


const metaSchema = new mongoose.Schema(
    {
        fromBuyNow: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        firebaseUid: { type: String, required: true, index: true },
        useremail: { type: String },
        productData: { type: pricingSchema, required: true },
        paymentMethod: {
            type: String,
            enum: ["upi", "cc", "dc", "nb", "emi", "upi_p", "unknown"],
            required: true,
        },
        orderId: { type: String, required: true },
        paymentId: { type: String, default: null },
        txnId: { type: String, default: null },
        status: {
            type: String,
            enum: ["pending", "processing", "delivered", "cancelled", "refunded"],
            default: "pending",
        },
        cancelled: {
            isCancelled: { type: Boolean, default: false },
            cancellation_reason: { type: String, default: null },
            cancelledAt: { type: Date, default: null },
            refunded: { type: Boolean, default: false },
            refundId: { type: String, default: null },
            refundDate: { type: Date, default: null },
            refundAmount: { type: Number, default: null },
        },

        emailSent: { type: Boolean, default: false },
        emailSentAt: { type: Date, default: null },
        adminNote: { type: String, default: null },
        meta: { type: metaSchema, required: true },
    },
    { timestamps: true }
);


orderSchema.index({ firebaseUid: 1, createdAt: -1 });

orderSchema.index({ paymentId: 1 });


export default mongoose.model("Order", orderSchema);
