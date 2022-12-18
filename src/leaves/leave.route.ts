import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import { checkIdExists } from "../Middleware/checkIdExists";
import {
  createLeave,
  deleteLeave,
  getLeave,
  getLeaves,
} from "./leave.controller";

// Path: /leaves

const leaveRouter = express.Router();

leaveRouter.post("/", authenticateToken, createLeave);
leaveRouter.get("/", authenticateToken, getLeaves);
leaveRouter.get("/byId", authenticateToken, checkIdExists, getLeave);
leaveRouter.put("/", authenticateToken);
leaveRouter.delete("/", authenticateToken, checkIdExists, deleteLeave);

export default leaveRouter;
