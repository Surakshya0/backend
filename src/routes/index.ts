import { Router } from "express";
import userRouter from "./user.route";
import { login } from "../controllers/auth.controller"; 

const router = Router();

router.use("/user", userRouter);
router.post("/login", login); 


export default router;
