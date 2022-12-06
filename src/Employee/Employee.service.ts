import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { EmployeeType } from "./Employee.controller";
import bcrypt from "bcrypt";
import Employees from "../Employee/Employee.model";

class EmployeeService {
  private static employeeService: EmployeeService;

  constructor() {}

  static getInstance() {
    if (!this.employeeService) {
      this.employeeService = new EmployeeService();
    }
    return this.employeeService;
  }

  async getEmployees() {
    try {
      const employees = await Employees.find();
      return employees;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async getEmployeeById(id: string) {
    try {
      const employee = await Employees.findById(id);
      return employee;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async addEmployee(data: EmployeeType) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.emp_id, salt);
      const employee = await Employees.create({
        ...data,
        password: hashedPassword,
      });
      return { employee };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default EmployeeService.getInstance();
