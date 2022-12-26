import {
  createEmployeeLeave,
  getEmployeeLeaves,
  getCurrentHodEmployeeLeaves,
  getEmployeeLeavesByDepartment,
  getCurrentEmployeeLeaves,
  getLeavesByEmployeeID,
  updateLeaveByHod,
  updateLeaveByPrincipal,
  deleteEmployeeLeave,
} from "./employeeLeave.controller";
import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import { checkIdExists } from "../Middleware/checkIdExists";

// Path: /employeeLeaves

const employeeLeaveRouter = express.Router();

// Post routes
employeeLeaveRouter.post("/create", authenticateToken, createEmployeeLeave);

// Get routes
employeeLeaveRouter.get("/all", authenticateToken, getEmployeeLeaves);
employeeLeaveRouter.get(
  "/byCurrentEmployee",
  authenticateToken,
  getCurrentEmployeeLeaves
);
employeeLeaveRouter.get("/byEmpId", authenticateToken, getLeavesByEmployeeID);
employeeLeaveRouter.get(
  "/byCurrentHod",
  authenticateToken,
  getCurrentHodEmployeeLeaves
);
employeeLeaveRouter.get(
  "/byDepartment",
  authenticateToken,
  getEmployeeLeavesByDepartment
);

// Update routes
employeeLeaveRouter.patch("/byHod", authenticateToken, updateLeaveByHod);
employeeLeaveRouter.patch(
  "/byPrincipal",
  authenticateToken,
  updateLeaveByPrincipal
);

// Delete routes
employeeLeaveRouter.delete(
  "/",
  authenticateToken,
  checkIdExists,
  deleteEmployeeLeave
);

export default employeeLeaveRouter;
