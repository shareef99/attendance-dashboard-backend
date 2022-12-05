import { Router } from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "./User.controller";

// path: /user
const userRouter = Router();
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", addUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
