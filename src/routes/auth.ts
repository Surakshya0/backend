import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

//  Login route
router.post("/login", login);

export default router;
