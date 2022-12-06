import { RequestHandler } from "express";
import { validateReq } from "../helpers/zod";
import employeeService from "./Employee.service";
import { z } from "zod";

const employeeSchema = z
  .object({
    name: z.string(),
    emp_id: z.string(),
    email: z.string().email(),
    mobile_no: z.number(),
    joining_date: z.string(),
    department: z.string(),
    emp_type: z.string(),
    designation: z.string(),
    role: z.number(),
  })
  .strict();

export type EmployeeType = z.infer<typeof employeeSchema>;

export const getEmployees: RequestHandler = async (req, res, next) => {
  try {
    const employees = await employeeService.getEmployees();
    return res.status(200).json({ employees });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const getEmployeeById: RequestHandler = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    return res.status(200).json({ employee });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const addEmployee: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(employeeSchema.safeParse(req.body));
    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }
    const employeeRes = await employeeService.addEmployee(validationRes.value);
    return res.status(201).json({
      message: "Employee created successfully",
      employee: employeeRes.employee,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
