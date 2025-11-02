const Product = require("../models/Product");

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

    return res.json({
      total,
      // page: pageNum,
      // limit: limitNum,
      // totalPages: Math.ceil(total / limitNum),
      data: products,
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
    res.json(product);
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
  return file.filename;
};

const createProduct = async (req,res) => {
  try{
    const payload = { ...req.body };
    payload.price = normalizeNumber(payload.price);
    payload.discount_price = normalizeNumber(payload.discount_price) ?? null;
    payload.calories = normalizeNumber(payload.calories) ?? null;

    const imagePath = formatImagePath(req.file);
    if (imagePath) {
      payload.image_url = imagePath;
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

    const imagePath = formatImagePath(req.file);
    if (imagePath) {
      payload.image_url = imagePath;
    } else if (payload.image_url === "") {
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
