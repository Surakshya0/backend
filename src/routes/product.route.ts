import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Create product (Admin only)
router.post("/", authenticate, authorize(["Admin"]), createProduct);

// Get all products (logged-in user only)
router.get("/", authenticate, getProducts);

// Update product (owner or Admin)
router.put("/:id", authenticate, updateProduct);

// Delete product (owner or Admin)
router.delete("/:id", authenticate, deleteProduct);

export default router;
