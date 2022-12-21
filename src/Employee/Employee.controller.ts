import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import employeeService from "./employee.service";
import { z } from "zod";
import employeeModel from "./employee.model";
import { leaveType } from "../leaves/leave.controller";

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

const personalSchema = z
  .object({
    emp_id: z.string(),
    name: z.string(),
    gender: z.enum(["male", "female", "others"]).optional(),
    dob: z.string().optional(),
    married: z.boolean().optional(),
    marriedDate: z.string().optional(),
    designation: z.string(),
    department: z.string(),
    address: z.string().optional(),
    mobile_no: z.number(),
    email: z.string().email(),
    joining_date: z.string(),
    bankAccountNo: z.number().optional(),
    bankName: z.string().optional(),
    IFSCCode: z.string().optional(),
    pancardNo: z.string().optional(),
    pfNo: z.string().optional(),
    aadharNo: z.number().optional(),
    RTGSNo: z.string().optional(),
    emp_type: z.string(),
  })
  .strict();

export type BoardType = z.infer<typeof boardSchema>;

export type EmployeeType = z.infer<typeof employeeSchema>;

export type EmployeeLeaveType = z.infer<typeof leaveSchema>;

export type PersonalDetailsType = z.infer<typeof personalSchema>;

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
    const user = req.user;

    const employees = await employeeModel
      .find({ department: user.department })
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

export const updatePersonalDetails: RequestHandler = async (req, res) => {
  try {
    const user = req.user;

    if (user.role > 2) {
      return res.status(400).json({
        message: "You don't have permission to update personal details ",
      });
    }

    const validationRes = validateReq(personalSchema.safeParse(req.body));

    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }

    const data = validationRes.value as PersonalDetailsType;

    await employeeModel.findOneAndUpdate(
      { emp_id: data.emp_id },
      {
        $set: {
          name: data.name,
          email: data.email,
          department: data.department,
          designation: data.designation,
          mobile_no: data.mobile_no,
          joining_date: data.joining_date,
          "personalDetails.gender": data.gender,
          "personalDetails.dob": data.dob,
          "personalDetails.married": data.married,
          "personalDetails.marriedDate": data.marriedDate,
          "personalDetails.bankAccountNo": data.bankAccountNo,
          "personalDetails.bankName": data.bankName,
          "personalDetails.IFSCCode": data.IFSCCode,
          "personalDetails.pancardNo": data.pancardNo,
          "personalDetails.pfNo": data.pfNo,
          "personalDetails.aadharNo": data.aadharNo,
          "personalDetails.RTGSNo": data.RTGSNo,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Personal Details updated successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
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

export const getEmployeesWithLeaves: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const allEmployees = await employeeModel
      .find({ department: user.department })
      .select("-password -personalDetails -qualificationDetails -otherDetails");
    let employeesWithLeaves: any[] = [];

    allEmployees
      .filter((employee) => employee.leaves.length > 0)
      .forEach((employee) =>
        employee.leaves.forEach((leave) =>
          employeesWithLeaves.push({
            // @ts-ignore
            leave_id: leave._id,
            emp_id: employee.emp_id,
            name: employee.name,
            department: employee.department,
            from: leave.from,
            to: leave.to,
            leave_duration: leave.leave_duration,
            status: leave.status,
          })
        )
      );
    return res.status(200).json({ employees: employeesWithLeaves });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "something went wrong" });
  }
};

export const getEmployeesWithUpcomingLeaves: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = req.user;

    const employees = await employeeModel
      .find({ department: user.department })
      .select("-password");

    // I don't want to use any but sir wants the project to be end as soon as possible so I have no choice
    // Don't blame the developer blame Bari sir
    const employeesWithUpcomingLeaves: Array<{
      emp_id: string;
      name: string;
      leave: {
        name: string;
        status: string;
        shortname: string;
        from: Date;
        to: Date;
        leave_duration: string;
      };
    }> = [];

    employees.forEach((employee) => {
      for (const leave of employee.leaves) {
        if (+leave.from > Date.now()) {
          employeesWithUpcomingLeaves.push({
            emp_id: employee.emp_id!,
            name: employee.name!,
            leave,
          });
          break;
        }
      }
    });

    return res.status(200).json({ employees: employeesWithUpcomingLeaves });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const approveLeaveByHod: RequestHandler = async (req, res) => {
  try {
    const user = req.user;

    if (user.role > 2) {
      return res
        .status(400)
        .json({ message: "You don't have permission to approve the leave" });
    }

    const emp_id = req.query.emp_id?.toString();
    const leave_id = req.query.leave_id?.toString();

    if (!emp_id) {
      return res.status(400).json({ message: "Emp Id is missing" });
    }
    if (!leave_id) {
      return res.status(400).json({ message: "Leave Id is missing" });
    }

    const employee = await employeeModel.findOne({
      emp_id: emp_id,
    });

    if (!employee) {
      return res
        .status(400)
        .json({ message: "Can't find emp with id " + emp_id });
    }

    const updatedLeaves = employee.leaves.map((leave) =>
      // Every MongoDb object has _id property. IDK why TypeScript is screaming it doesn't have _id property.
      // Must use ==, because mongodb _id is not string but leave_id is string
      // @ts-ignore
      leave._id == leave_id
        ? {
            name: leave.name,
            shortname: leave.shortname,
            from: leave.from,
            to: leave.to,
            leave_duration: leave.leave_duration,
            status: "pending-principal",
          }
        : {
            name: leave.name,
            shortname: leave.shortname,
            from: leave.from,
            to: leave.to,
            leave_duration: leave.leave_duration,
            status: leave.status,
          }
    );

    await employeeModel.findOneAndUpdate(
      { emp_id: emp_id },
      {
        $set: {
          leaves: updatedLeaves,
        },
      }
    );

    return res.status(400).json({ message: "Approved by HOD" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const approveLeaveByPrincipal: RequestHandler = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 1) {
      return res
        .status(400)
        .json({ message: "You don't have permission to approve the leave" });
    }

    const emp_id = req.query.emp_id?.toString();
    const leave_id = req.query.leave_id?.toString();

    if (!emp_id) {
      return res.status(400).json({ message: "Emp Id is missing" });
    }
    if (!leave_id) {
      return res.status(400).json({ message: "Leave Id is missing" });
    }

    const employee = await employeeModel.findOne({
      emp_id: emp_id,
    });

    if (!employee) {
      return res
        .status(400)
        .json({ message: "Can't find emp with id " + emp_id });
    }

    const updatedLeaves = employee.leaves.map((leave) =>
      // Every MongoDb object has _id property. IDK why TypeScript is screaming it doesn't have _id property.
      // Must use ==, because mongodb _id is not string but leave_id is string
      // @ts-ignore
      leave._id == leave_id
        ? {
            name: leave.name,
            shortname: leave.shortname,
            from: leave.from,
            to: leave.to,
            leave_duration: leave.leave_duration,
            status: "approved",
          }
        : {
            name: leave.name,
            shortname: leave.shortname,
            from: leave.from,
            to: leave.to,
            leave_duration: leave.leave_duration,
            status: leave.status,
          }
    );

    await employeeModel.findOneAndUpdate(
      { emp_id: emp_id },
      {
        $set: {
          leaves: updatedLeaves,
        },
      }
    );

    return res.status(400).json({ message: "Approved by Principal" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};
