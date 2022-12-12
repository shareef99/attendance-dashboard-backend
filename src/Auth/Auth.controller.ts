import { RequestHandler } from "express";
import _ from "lodash";
import { z } from "zod";
import { validateReq } from "../helpers/zod";
import authService from "./Auth.service";

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
    const signinRes = await authService.signin(validationRes.value);
    const employee = signinRes.employee;
    return res.status(200).json({
      token: signinRes.token,
      employee: {
        _id: employee._id,
        name: employee.name,
        empId: employee.emp_id,
        email: employee.email,
        mobileNo: employee.mobile_no,
        joiningDate: employee.joining_date,
        department: employee.department,
        empType: employee.emp_type,
        designation: employee.designation,
        role: employee.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
