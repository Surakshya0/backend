import { Router } from "express";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/user.controller"; 


const userRouter = Router();

userRouter.get("/", getAllUsers);

userRouter.post("/", addUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
