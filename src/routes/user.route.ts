import { Router } from "express";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const userRouter = Router();

// Only admin can see all users
userRouter.get("/", authenticate, authorize(["admin"]), getAllUsers);

// Only admin can delete users
userRouter.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

// Normal users can update themselves (if you want, you can skip authorize here)
userRouter.put("/:id", authenticate, updateUser);

// Everyone can register
userRouter.post("/", addUser);

export default userRouter;
