import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";


const productRouter = Router();

productRouter.get("/", authenticate, getAllProducts);
productRouter.get("/my", authenticate, getMyProducts);
productRouter.post("/", authenticate, addProduct);
productRouter.put("/:id", authenticate, updateProduct);
productRouter.delete("/:id", authenticate, deleteProduct);


export default productRouter;
