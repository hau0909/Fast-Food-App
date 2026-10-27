const Product = require("../models/Product");

// Helper function to build full image URL from request
const buildImageUrlFromRequest = (req, imageUrl) => {
  if (!imageUrl) return imageUrl;
  
  // Nếu đã là full URL external (http/https), giữ nguyên
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    // Nếu là localhost, thay thế bằng host từ request
    if (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1")) {
      const protocol = req.protocol || "http";
      const host = req.get("host") || `${req.hostname}:${process.env.PORT || 8000}`;
      // Giữ nguyên path sau localhost
      const path = imageUrl.split("/").slice(3).join("/");
      return `${protocol}://${host}/${path}`;
    }
    return imageUrl;
  }
  
  // Nếu là relative path hoặc filename, build full URL
  const protocol = req.protocol || "http";
  const host = req.get("host") || `${req.hostname}:${process.env.PORT || 8000}`;
  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/uploads/${imageUrl}`;
  return `${protocol}://${host}${normalizedPath}`;
};

// Helper function to transform product with full image URL
const transformProduct = (product, req) => {
  if (!product) return product;
  const productObj = product.toObject ? product.toObject() : product;
  if (productObj.image_url) {
    productObj.image_url = buildImageUrlFromRequest(req, productObj.image_url);
  }
  return productObj;
};

// [GET] /api/product
const getAllProducts = async (req, res, next) => {
  try {
    const { filter, sortOptions, paging } = req;
    // const { skip, limitNum, pageNum } = paging;

    const [products, total] = await Promise.all([
      Product.find(filter).populate("category_id", "name").sort(sortOptions),
      // .skip(skip)
      // .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    // Transform products to include full image URLs based on request
    const transformedProducts = products.map(product => transformProduct(product, req));

    return res.json({
      total,
      // page: pageNum,
      // limit: limitNum,
      // totalPages: Math.ceil(total / limitNum),
      data: transformedProducts,
    });
  } catch (err) {
    return next(err);
  }
};

// [GET] /api/product/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category_id",
      "name"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    const transformedProduct = transformProduct(product, req);
    res.json(transformedProduct);
  } catch (err) {
    next(err);
  }
};

const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const formatImagePath = (file) => {
  if (!file) return undefined;
  // Build full URL instead of just filename
  const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

const createProduct = async (req,res) => {
  try{
    const payload = { ...req.body };
    payload.price = normalizeNumber(payload.price);
    payload.discount_price = normalizeNumber(payload.discount_price) ?? null;
    payload.calories = normalizeNumber(payload.calories) ?? null;

    // Nếu có file upload, ưu tiên file upload (lưu full URL local)
    const imagePath = formatImagePath(req.file);
    if (imagePath) {
      payload.image_url = imagePath;
    } else if (payload.image_url && (payload.image_url.startsWith("http://") || payload.image_url.startsWith("https://"))) {
      // Nếu không có file upload nhưng có image_url là full URL external, giữ nguyên
      // payload.image_url đã là full URL, không cần thay đổi
    } else if (payload.image_url === "") {
      // Nếu image_url là chuỗi rỗng, xóa nó
      delete payload.image_url;
    }

    const product = new Product(payload);
    const saved = await product.save();
    const populated = await saved.populate("category_id", "name");
    res.status(201).json(populated);
  } catch(error) {
    res.status(500).json({ message: error.message});
  }
};

const updateProduct = async(req, res) => {
  try{
    const payload = { ...req.body };
    if (payload.price !== undefined) {
      payload.price = normalizeNumber(payload.price);
    }
    if (payload.discount_price !== undefined) {
      payload.discount_price = normalizeNumber(payload.discount_price);
      if (payload.discount_price === undefined) payload.discount_price = null;
    }
    if (payload.calories !== undefined) {
      payload.calories = normalizeNumber(payload.calories);
      if (payload.calories === undefined) payload.calories = null;
    }

    // Nếu có file upload, ưu tiên file upload (lưu full URL local)
    const imagePath = formatImagePath(req.file);
    if (imagePath) {
      payload.image_url = imagePath;
    } else if (payload.image_url && (payload.image_url.startsWith("http://") || payload.image_url.startsWith("https://"))) {
      // Nếu không có file upload nhưng có image_url là full URL external, giữ nguyên
      // payload.image_url đã là full URL, không cần thay đổi
    } else if (payload.image_url === "") {
      // Nếu image_url là chuỗi rỗng, xóa nó
      delete payload.image_url;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const populated = await product.populate("category_id", "name");
    res.json(populated);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
