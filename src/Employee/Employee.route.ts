import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import { checkIdExists } from "../Middleware/checkIdExists";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  applyForLeave,
  deleteEmployee,
  updateSSCDetails,
  getEmployeesByDepartment,
} from "./employee.controller";

// Path: /employees
const employeeRouter = express.Router();

employeeRouter.get("/", authenticateToken, getEmployees);
employeeRouter.get("/byId", authenticateToken, checkIdExists, getEmployeeById);
employeeRouter.get(
  "/byDepartment",
  authenticateToken,
  getEmployeesByDepartment
);
employeeRouter.post("/", authenticateToken, addEmployee);
employeeRouter.put("/", authenticateToken);
employeeRouter.put("/qualification", authenticateToken, updateSSCDetails);
employeeRouter.delete("/", authenticateToken, deleteEmployee);

employeeRouter.post("/apply-leave/:id", authenticateToken, applyForLeave);

export default employeeRouter;
