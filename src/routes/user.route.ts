import { Router } from "express";
import { addUser, getAllUsers, updateUser } from "../controllers/user.controller"; 
// 👆 removed `.js` because TS resolves `.ts`

const userRouter = Router();

userRouter.get("/", getAllUsers);

userRouter.post("/", addUser);

userRouter.put("/:id", updateUser);

// Example if you later add deleteUser
// userRouter.delete("/:id", deleteUser);

export default userRouter;
