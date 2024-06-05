import express from "express";
import formidable from "express-formidable";
import { authenticate, authorise } from "../middlewares/authentication.js";
import checkId from "../middlewares/checkId.js";
import {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  allProducts,
  addReview,
  fetchTop,
  fetchNew,
} from "../controllers/productContorller.js";
const router = express.Router();

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorise, formidable(), addProduct);
router.route("/allproducts").get(allProducts);
router.route("/top").get(fetchTop);
router.get("/new", fetchNew);
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorise, formidable(), updateProduct)
  .delete(authenticate, authorise, removeProduct);
router.route(":/id/reviews").post(authenticate, authorise, checkId, addReview);
export default router;
