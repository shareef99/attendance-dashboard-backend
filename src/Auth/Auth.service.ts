import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { SigninType } from "./Auth.controller";
import bcrypt from "bcrypt";
import Employees from "../Employee/Employee.model";

class AuthService {
  private static authService: AuthService;

  constructor() {}

  static getInstance() {
    if (!this.authService) {
      this.authService = new AuthService();
    }
    return this.authService;
  }

  async signin(data: SigninType) {
    try {
      const employee = await Employees.findOne({ emp_id: data.emp_id });

      if (!employee) {
        throw new Error("Invalid Employee ID");
      }

      const isValidPassword = await bcrypt.compare(
        data.password,
        employee.password!
      );

      if (!isValidPassword) {
        throw new Error("Invalid Password");
      }

      // read the private key
      const privateKey = await fs.readFile(
        path.join(__dirname, "..", "..", "private.key"),
        "utf-8"
      );

      const token = jwt.sign(
        { id: data.emp_id, password: data.emp_id },
        privateKey,
        { algorithm: "RS256", expiresIn: "12h" }
      );

      return { token, employee };
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

export default AuthService.getInstance();
