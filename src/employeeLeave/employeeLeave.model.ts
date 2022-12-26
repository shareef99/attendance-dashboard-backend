import { Schema, model } from "mongoose";

const employeeLeaveModel = new Schema(
  {
    emp_id: {
      type: String,
      require: true,
    },
    emp_name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      require: true,
    },
    leave_name: {
      type: String,
      require: true,
    },
    leave_shortname: {
      type: String,
      require: true,
    },
    from: {
      type: Date,
      require: true,
    },
    to: {
      type: Date,
      require: true,
    },
    duration: {
      type: String,
      enum: ["half-day", "full-day"],
      require: true,
    },
    status: {
      type: String,
      enum: [
        "pending-hod",
        "pending-principal",
        "reject-hod",
        "reject-principal",
        "approved",
      ],
      default: "pending-hod",
      require: true,
    },
    limit: {
      type: Number,
      require: true,
    },
    // Id of the employee who updated it
    updated_by: {
      type: String,
      require: true,
      default: "none",
    },
    remark_by_hod: { type: String, default: null },
    remark_by_principal: { type: String, default: null },
    is_updated_by_principal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default model("EmployeeLeaves", employeeLeaveModel);
