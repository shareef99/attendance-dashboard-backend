import { RequestHandler } from "express";
import _ from "lodash";
import { z } from "zod";
import { validateReq } from "../helpers/zod";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import Employees from "../employee/employee.model";

const signinSchema = z
  .object({
    emp_id: z.string(),
    password: z.string(),
  })
  .strict();

export type SigninType = z.infer<typeof signinSchema>;

export const signin: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(signinSchema.safeParse(req.body));
    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }

    const data = validationRes.value as SigninType;

    const employee = await Employees.findOne({ emp_id: data.emp_id });

    if (!employee) {
      return res.status(400).json({
        message: "Invalid Employee ID",
      });
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      employee.password!
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // read the private key
    const privateKey = await fs.readFile(
      path.join(__dirname, "..", "..", "private.key"),
      "utf-8"
    );

    const token = jwt.sign(
      {
        id: data.emp_id,
        password: data.emp_id,
        role: employee.role,
        department: employee.department,
      },
      privateKey,
      { algorithm: "RS256", expiresIn: "12h" }
    );

    return res.status(200).json({
      token: token,
      employee: {
        _id: employee._id,
        name: employee.name,
        emp_id: employee.emp_id,
        email: employee.email,
        mobile_no: employee.mobile_no,
        joining_date: employee.joining_date,
        department: employee.department,
        emp_type: employee.emp_type,
        designation: employee.designation,
        role: employee.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
