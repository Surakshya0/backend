import { Router } from "express";
import userRouter from "./user.route";
import productRouter from "./product.route";
import { login } from "../controllers/auth.controller";

const router = Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.post("/login", login);

export default router;
