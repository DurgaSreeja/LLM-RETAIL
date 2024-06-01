import express from "express";
import { authenticate, authorise } from "../middlewares/authentication.js";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.route("/").post(authenticate, authorise, createCategory);
router
  .route("/:cId")
  .put(authenticate, authorise, updateCategory)
  .delete(authenticate, authorise, removeCategory)
  .get(readCategory);
router.route("/categories").get(listCategory);
export default router;
