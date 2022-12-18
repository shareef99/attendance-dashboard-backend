import { EmployeeType } from "./employee.controller";
import bcrypt from "bcrypt";
import employeeModel from "./employee.model";

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
      const employee = await employeeModel.create({
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
