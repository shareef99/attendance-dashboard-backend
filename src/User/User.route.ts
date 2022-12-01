import { Router } from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import { getUsers } from "./User.controller";

// path: /user
const userRouter = Router();
userRouter.get("/", authenticateToken, getUsers);

export default userRouter;