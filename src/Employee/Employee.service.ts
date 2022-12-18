import {
  BoardType,
  EmployeeLeaveType,
  EmployeeType,
} from "./employee.controller";
import bcrypt from "bcrypt";
import Employees from "./employee.model";
import employeeModel from "./employee.model";
import _ from "lodash";

class EmployeeService {
  private static employeeService: EmployeeService;

  constructor() {}

  static getInstance() {
    if (!this.employeeService) {
      this.employeeService = new EmployeeService();
    }
    return this.employeeService;
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

  async deleteEmployee(id: string) {
    try {
      await Employees.findByIdAndDelete(id);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async applyForLeave(data: EmployeeLeaveType, id: string) {
    try {
      await employeeModel.findOneAndUpdate(
        { emp_id: id },
        {
          $push: { leaves: data },
        }
      );
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default EmployeeService.getInstance();
