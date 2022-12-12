import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxLength: 40,
    trim: true,
  },
  emp_id: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  mobile_no: {
    type: Number,
    require: true,
    unique: true,
  },
  joining_date: {
    type: Date,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  emp_type: {
    type: String,
    require: true,
  },
  designation: {
    type: String,
    require: true,
  },
  role: {
    type: Number,
    require: true,
  },
  leaves: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        shortName: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
          required: true,
        },
        leaveDuration: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
});

export default mongoose.model("Employees", employeeSchema);
