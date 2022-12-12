import express from "express";
import { authenticateToken } from "../Middleware/authenticateToken";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  applyForLeave,
} from "./employee.controller";

// Path: /employee
const employeeRouter = express.Router();

employeeRouter.get("/", authenticateToken, getEmployees);
employeeRouter.get("/:id", authenticateToken, getEmployeeById);
employeeRouter.post("/", authenticateToken, addEmployee);
employeeRouter.put("/", authenticateToken);
employeeRouter.delete("/", authenticateToken);

employeeRouter.post("/apply-leave/:id", authenticateToken, applyForLeave);

export default employeeRouter;
