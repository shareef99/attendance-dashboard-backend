import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
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
leaveRouter.get("/:id", authenticateToken, getLeave);
leaveRouter.put("/", authenticateToken);
leaveRouter.delete("/:id", authenticateToken, deleteLeave);

export default leaveRouter;
