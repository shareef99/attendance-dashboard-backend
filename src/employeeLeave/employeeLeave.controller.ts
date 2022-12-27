import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import { z } from "zod";
import employeeLeaveModel from "./employeeLeave.model";
import employeeModel from "../employee/employee.model";
import leaveModel from "../leaves/leave.model";

const employeeLeaveSchema = z.strictObject({
  emp_id: z.string(),
  emp_name: z.string(),
  department: z.string(),
  leave_name: z.string(),
  leave_shortname: z.string(),
  from: z.string(),
  to: z.string(),
  duration: z.enum(["half-day", "full-day"]),
  status: z.enum([
    "pending-hod",
    "pending-principal",
    "reject-hod",
    "reject-principal",
    "approved",
  ]),
  limit: z.number(),
});

const updateLeaveByHodSchema = z.strictObject({
  id: z.string(),
  status: z.enum(["pending-principal", "reject-hod"]),
  remarks: z.string(),
  updated_by: z.string(),
});

const updateLeaveByPrincipalSchema = z.strictObject({
  id: z.string(),
  emp_id: z.string(),
  status: z.enum(["approved", "reject-principal"]),
  updated_by: z.string(),
  remarks: z.string(),
  leave_shortname: z.string(),
  limit: z.number(),
  number_of_days: z.number(),
});

type CreateEmployeeLeaveType = z.infer<typeof employeeLeaveSchema>;
type UpdateLeaveByHodType = z.infer<typeof updateLeaveByHodSchema>;
type UpdateLeaveByPrincipalType = z.infer<typeof updateLeaveByPrincipalSchema>;

// Post Methods
export const createEmployeeLeave: RequestHandler = async (req, res) => {
  try {
    const validationResult = validateReq(
      employeeLeaveSchema.safeParse(req.body)
    );

    if (validationResult.error) {
      return res.json({ message: validationResult.value });
    }

    const data = validationResult.value as CreateEmployeeLeaveType;

    await employeeLeaveModel.create({ ...data });

    return res
      .status(201)
      .json({ message: "Employee leave created successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

// Get Methods
export const getEmployeeLeaves: RequestHandler = async (req, res) => {
  try {
    const employeeLeaves = await employeeLeaveModel.find();
    return res.status(200).json({ employeeLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const getCurrentEmployeeLeaves: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const employeeLeaves = await employeeLeaveModel.find({
      emp_id: user.id,
    });
    return res.status(200).json({ employeeLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const getLeavesByEmployeeID: RequestHandler = async (req, res) => {
  try {
    const id = req.query.id?.toString();

    if (!id) {
      return res.status(400).json({ message: "ID is missing" });
    }

    const employeeLeaves = await employeeLeaveModel.find({
      emp_id: id,
    });
    return res.status(200).json({ employeeLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const getCurrentHodEmployeeLeaves: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const employeeLeaves = await employeeLeaveModel.find({
      department: user.department,
    });
    return res.status(200).json({ employeeLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const getEmployeeLeavesByDepartment: RequestHandler = async (
  req,
  res
) => {
  try {
    const department = req.query.department?.toString();

    if (!department) {
      return res.status(400).json({ message: "Department is missing" });
    }

    const employeeLeaves = await employeeLeaveModel.find({
      department: department,
    });
    return res.status(200).json({ employeeLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

// Update Methods
export const updateLeaveByHod: RequestHandler = async (req, res) => {
  try {
    const validationResult = validateReq(
      updateLeaveByHodSchema.safeParse(req.body)
    );

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.value });
    }

    const data = validationResult.value as UpdateLeaveByHodType;

    const leave = await employeeLeaveModel.findById(data.id);

    if (!leave) {
      return res
        .status(400)
        .json({ message: "No leave exits with id: " + data.id });
    }

    if (leave.is_updated_by_principal) {
      return res
        .status(400)
        .json({ message: "HOD can't update after principal sir updated." });
    }

    await leave.updateOne({
      $set: {
        status: data.status,
        remark_by_hod: data.remarks,
        updated_by: data.updated_by,
      },
    });

    return res.status(200).json({ message: "Leave updated successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const updateLeaveByPrincipal: RequestHandler = async (req, res) => {
  try {
    const validationResult = validateReq(
      updateLeaveByPrincipalSchema.safeParse(req.body)
    );

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.value });
    }

    const data = validationResult.value as UpdateLeaveByPrincipalType;
    const leave = await employeeLeaveModel.findById(data.id);

    if (!leave) {
      return res
        .status(400)
        .json({ message: "No leave exits with id: " + data.id });
    }

    if (data.status === "reject-principal") {
      await leave.updateOne({
        $set: {
          status: data.status,
          remark_by_principal: data.remarks,
          updated_by: data.updated_by,
          is_updated_by_principal: true,
        },
      });

      return res.status(200).json({ message: "Leave updated successfully" });
    }

    const employee = await employeeModel.findOne({ emp_id: data.emp_id });

    if (!employee) {
      return res
        .status(400)
        .json({ message: "No employee exits with id: " + data.emp_id });
    }

    // There are the leaves of the employee
    let employeeLeaves = employee.leaves;

    let currentLeave = employeeLeaves.find(
      (employeeLeave) => employeeLeave.shortname === data.leave_shortname
    );

    if (!currentLeave) {
      currentLeave = {
        shortname: data.leave_shortname,
        no_of_leaves_taken: 0,
      };
      employeeLeaves.push(currentLeave);
    }

    const totalLeavesTaken =
      currentLeave.no_of_leaves_taken + data.number_of_days;
    currentLeave.no_of_leaves_taken = totalLeavesTaken;

    employeeLeaves = employeeLeaves.map((employeeLeave) =>
      employeeLeave.shortname === currentLeave?.shortname
        ? {
            shortname: employeeLeave.shortname,
            no_of_leaves_taken: totalLeavesTaken,
          }
        : {
            shortname: employeeLeave.shortname,
            no_of_leaves_taken: employeeLeave.no_of_leaves_taken,
          }
    );

    if (totalLeavesTaken <= data.limit) {
      await leave.updateOne({
        $set: {
          status: data.status,
          remark_by_principal: data.remarks,
          updated_by: data.updated_by,
          is_updated_by_principal: true,
        },
      });
      await employee.updateOne({
        $set: {
          leaves: employeeLeaves,
        },
      });

      return res.status(200).json({ message: "Leave updated successfully" });
    }

    if (!employee.salary) {
      return res
        .status(400)
        .json({ message: `Employee ${data.emp_id} doesn't have salary` });
    }

    const empSalary = employee.salary;
    const noOfExceedingLeaves = totalLeavesTaken - data.limit;
    const perDaySalary = +(employee.salary / 30).toFixed(2);
    const salaryToBeDeducted = +(noOfExceedingLeaves * perDaySalary).toFixed(2);
    const salaryAfterDeduction = +(empSalary - salaryToBeDeducted).toFixed(2);

    await leave.updateOne({
      $set: {
        status: data.status,
        remark_by_principal: data.remarks,
        updated_by: data.updated_by,
        is_updated_by_principal: true,
      },
    });
    await employee.updateOne({
      $set: {
        deducted_salary: salaryToBeDeducted,
        final_salary: salaryAfterDeduction,
        leaves: employeeLeaves,
      },
    });

    return res.status(200).json({
      message: "Leave updated successfully",
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

// Delete Method
export const deleteEmployeeLeave: RequestHandler = async (req, res) => {
  try {
    const id = req.query.id;
    await employeeLeaveModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Employee Leave Deleted" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};
