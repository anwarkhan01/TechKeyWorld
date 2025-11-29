import XLSX from "xlsx";
import path from "path";
import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateKeywords from "../utils/keywordGenerator.js";
import parsePipeArray from "../utils/parsePipeArray.js";

function parseSpecs(specString) {
  if (!specString || typeof specString !== "string") return {};
  const specs = {};
  const entries = specString.split(";");
  for (let entry of entries) {
    const [key, value] = entry.split(":").map((s) => s.trim());
    if (key && value) specs[key] = value;
  }
  return specs;
}

const importProducts = asyncHandler(async (req, res, next) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "assets",
      "TechKey_dummy_data.csv"
    );

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const filteredData = data.filter((item) =>
      Object.values(item).some((v) => v !== undefined && v !== null && v !== "")
    );

    if (filteredData.length === 0) {
      return next(new ApiError(400, "No valid data in the sheet"));
    }

    console.log(`Importing ${filteredData.length} products…`);

    const bulkOps = filteredData.map((item) => {
      const updateData = {
        product_id: item.SKU || null,
        product_name: item.Product_Name || "",
        category: item.Category || "",
        product_type: item.Product_Type || "",
        platform: item.Platform || "",
        version: item.Version ? String(item.Version) : "",
        publisher: item.Publisher || "",
        license_type: item.License_Type || "",
        duration: item.Duration_Months ? String(item.Duration_Months) : "",
        device_limit: Number(item.Device_Limit) || 0,
        mrp: Number(item.MRP_INR) || 0,
        price: Number(item.Selling_Price_INR) || 0,
        description: item.Description || "",
        features: parsePipeArray(item.Features),
        system_requirements: parsePipeArray(item.System_Requirements),
        image_url: item.Image_URL || "",
        stock_quantity: Number(item.Stock_Quantity) || 0,
        activation_steps: parsePipeArray(item.Activation_Steps),
        status: item.Status || "active",

        // auto search keywords
        search_keywords: generateKeywords(
          item.Product_Name,
          item.Category,
          item.Product_Type,
          item.Platform,
          item.Version,
          item.Publisher
        ),
      };

      return {
        updateOne: {
          filter: { product_id: updateData.product_id },
          update: { $set: updateData },
          upsert: true,
        },
      };
    });

    // batch processing
    const batchSize = 100;
    for (let i = 0; i < bulkOps.length; i += batchSize) {
      const batch = bulkOps.slice(i, i + batchSize);
      await Product.bulkWrite(batch, { ordered: false });
    }

    console.log("Import successful");
    return res.json(
      new ApiResponse(
        200,
        `Successfully imported/updated ${filteredData.length} products`
      )
    );
  } catch (error) {
    console.error("Import error:", error.message);
    return next(
      new ApiError(
        500,
        "Error occurred while importing products",
        error.message
      )
    );
  }
});

const getproducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  res.json(
    new ApiResponse(200, "Products fetched", {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

const getRandomProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const products = await Product.aggregate([{ $sample: { size: limit } }]);
  res.json(
    new ApiResponse(200, "Random products fetched", {
      products,
      count: products.length,
    })
  );
});

const getFilterProducts = asyncHandler(async (req, res) => {
  const {
    category,
    product_type,
    platform,
    license_type,
    minPrice,
    maxPrice,
    page = 1,
    limit = 50,
    sort = "price",
    order = "asc",
  } = req.query;

  const filters = {};

  if (category) filters.category = category;
  if (product_type) filters.product_type = product_type;
  if (platform) filters.platform = platform;
  if (license_type) filters.license_type = license_type;

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === "desc" ? -1 : 1;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filters),
  ]);

  res.json(
    new ApiResponse(200, "Filtered products fetched", {
      products,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  );
});

const searchProducts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return next(new ApiError(400, "Search query is required"));
  }

  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (terms.length === 0) {
    return next(new ApiError(400, "Search query too short"));
  }

  // Create regex OR queries: /ms/i OR /office/i
  const regexQueries = terms.map((t) => ({
    search_keywords: { $regex: t, $options: "i" },
  }));

  const products = await Product.find({
    $and: regexQueries, // all terms must match (partial allowed)
  }).lean();

  res.json(
    new ApiResponse(200, "Search results fetched", {
      count: products.length,
      products,
    })
  );
});

const getProductsById = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, "Product IDs array required"));
  }

  const products = await Product.find({
    product_id: { $in: ids },
  }).lean();

  if (!products.length) {
    return next(new ApiError(404, "No products found for given IDs"));
  }

  res.json(new ApiResponse(200, "Products fetched", products));
});

export {
  importProducts,
  getproducts,
  getRandomProducts,
  getFilterProducts,
  getProductsById,
  searchProducts,
};
