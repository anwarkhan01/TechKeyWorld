import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_id: { type: String, unique: true, index: true },
    product_name: { type: String, index: true },
    category: { type: String },
    product_type: { type: String, },
    platform: { type: String },
    version: { type: String },
    publisher: { type: String },
    license_type: { type: String },
    duration: { type: String },
    device_limit: { type: Number },
    mrp: { type: Number },
    price: { type: Number },
    description: { type: String },
    features: { type: [String] },
    system_requirements: { type: [String] },
    image_url: { type: String },
    stock_quantity: { type: Number },
    activation_steps: { type: [String] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    search_keywords: { type: [String], index: true },
});

productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);
