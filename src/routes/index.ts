import { Router } from "express";
import userRouter from "./user.route"; // 👈 removed `.js`

const router = Router();

router.use("/user", userRouter);

export default router;
