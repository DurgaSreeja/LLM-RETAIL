import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModal.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "brand is required" });
      case !description:
        return res.json({ error: "description is required" });
      case !price:
        return res.json({ error: "price is required" });
      case !category:
        return res.json({ error: "category is required" });
      case !quantity:
        return res.json({ error: "quantity is required" });
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message );
    res.status(400).json(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "brand is required" });
      case !description:
        return res.json({ error: "description is required" });
      case !price:
        return res.json({ error: "price is required" });
      case !category:
        return res.json({ error: "category is required" });
      case !quantity:
        return res.json({ error: "quantity is required" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found " });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});

const allProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
});

const addReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() == req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already Reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});

const fetchTop = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ ratings: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});

const fetchNew = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  allProducts,
  addReview,
  fetchTop,
  fetchNew,
};
