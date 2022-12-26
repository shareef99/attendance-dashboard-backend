import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import { checkIdExists } from "../Middleware/checkIdExists";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  deleteEmployee,
  updateSSCDetails,
  getEmployeesByDepartment,
  updatePersonalDetails,
  getCurrentEmployee,
} from "./employee.controller";

// Path: /employees
const employeeRouter = express.Router();

// Post
employeeRouter.post("/", authenticateToken, addEmployee);

// Gets
employeeRouter.get("/", authenticateToken, getEmployees);
employeeRouter.get("/byId", authenticateToken, checkIdExists, getEmployeeById);
employeeRouter.get("/current", authenticateToken, getCurrentEmployee);
employeeRouter.get(
  "/byDepartment",
  authenticateToken,
  getEmployeesByDepartment
);

// Updates
employeeRouter.put(
  "/personalDetails",
  authenticateToken,
  updatePersonalDetails
);
employeeRouter.put("/qualification", authenticateToken, updateSSCDetails);

// Delete
employeeRouter.delete("/", authenticateToken, checkIdExists, deleteEmployee);

export default employeeRouter;
