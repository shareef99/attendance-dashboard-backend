import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import employeeService from "./employee.service";
import { z } from "zod";
import employeeModel from "./employee.model";

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

const leaveSchema = z
  .object({
    name: z.string(),
    shortname: z.string(),
    from: z.string(),
    to: z.string(),
    leave_duration: z.string(),
  })
  .strict();

const boardSchema = z
  .object({
    board: z.string(),
    yop: z.number(),
    percentage: z.number(),
  })
  .strict();

export type BoardType = z.infer<typeof boardSchema>;

export type EmployeeType = z.infer<typeof employeeSchema>;

export type EmployeeLeaveType = z.infer<typeof leaveSchema>;

export const getEmployees: RequestHandler = async (req, res, next) => {
  try {
    const employees = await employeeModel.find().select("-password");
    const structuredEmployees = employees.map((employee) => ({
      _id: employee._id,
      emp_id: employee.emp_id,
      department: employee.department,
      designation: employee.designation,
      name: employee.name,
      email: employee.email,
      mobile_no: employee.mobile_no,
      joining_date: employee.joining_date,
      emp_type: employee.emp_type,
    }));
    return res.status(200).json({ employees: structuredEmployees });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const getEmployeesByDepartment: RequestHandler = async (req, res) => {
  try {
    const department = req.query.department?.toString();
    if (!department) {
      return res.status(400).json({ message: "department is missing" });
    }
    const employees = await employeeModel
      .find({ department: department })
      .select("-password");

    return res.status(200).json({ employees: employees });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const getEmployeeById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query.id?.toString();

    const employee = await employeeModel
      .findOne({ emp_id: id })
      .select("-password");

    if (!employee) {
      return res
        .status(400)
        .json({ message: "Employee doesn't exists with the id: " + id });
    }

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

export const updateSSCDetails: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(boardSchema.safeParse(req.body));
    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }

    if (!req.query.id) {
      return res.status(400).json({ message: "Employee Id is missing" });
    }

    const id = req.query.id.toString();
    const data = validationRes.value;

    if (req.query.type === "ssc") {
      await employeeModel.findOneAndUpdate({
        emp_id: id,
        $set: {
          "qualificationDetails.ssc": {
            board: data.board,
            yearOfPassing: data.yop,
            percentage: data.percentage,
          },
        },
      });
      return res.status(204).json({
        message: "SSC detail update successfully",
      });
    }

    if (req.query.type === "inter") {
      await employeeModel.findOneAndUpdate({
        emp_id: id,
        $set: {
          "qualificationDetails.inter": {
            board: data.board,
            yearOfPassing: data.yop,
            percentage: data.percentage,
          },
        },
      });
      return res.status(204).json({
        message: "Inter detail update successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmployee: RequestHandler = async (req, res) => {
  try {
    const id = req.query.id;
    await employeeModel.findOneAndDelete({ emp_id: id });
    res.status(200).json({ message: `Employee Deleted with ${id}` });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "something went wrong" });
  }
};

export const applyForLeave: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(leaveSchema.safeParse(req.body));

    if (validationRes.error) {
      res.status(400).json({ message: validationRes });
    }

    const id = req.query.id?.toString();

    await employeeModel.findOneAndUpdate(
      { emp_id: id },
      {
        $push: { leaves: { ...validationRes.value, status: "pending-hod" } },
      }
    );
    res.status(201).json({ message: "Apply for leave successfully." });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "something went wrong" });
  }
};
