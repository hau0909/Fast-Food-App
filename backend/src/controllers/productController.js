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

module.exports = { getAllProducts, getProductById };
