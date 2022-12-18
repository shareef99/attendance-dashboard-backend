import { Schema, model } from "mongoose";

const personalDetailsSchema = new Schema({
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "others"],
    },
  },
  dob: Date,
  married: Boolean,
  marriedDate: Date,
  address: String,
  bankAccountNo: Number,
  bankName: String,
  IFSCCode: String,
  pancardNo: String,
  pfNo: String,
  aadharNo: String,
  RTGSNo: String,
});

const qualificationDetailsSchema = new Schema({
  ssc: {
    board: String,
    yearOfPassing: Number,
    percentage: Number,
  },
  inter: {
    board: String,
    yearOfPassing: Number,
    percentage: Number,
  },
  degree: {
    qualification: String,
    branch: String,
    yearOfPassing: Number,
    percentage: Number,
    remarks: String,
  },
  pg: [
    {
      qualification: String,
      specification: String,
      yearOfPassing: Number,
      percentage: Number,
      remarks: String,
      grade: String,
    },
  ],
  other: [
    {
      qualification: String,
      specification: String,
      yearOfPassing: Number,
      percentage: Number,
      remarks: String,
      grade: String,
    },
  ],
});

const experienceSchema = new Schema({
  institute: String,
  type: String,
  from: Date,
  to: Date,
  designation: String,
  subjects: [String],
  salary: Number,
});

const familySchema = new Schema({
  memberName: String,
  relation: String,
  dob: Date,
  age: Number,
  aadharNo: Number,
  insuranceName: String,
  insuranceNo: String,
});

const otherDetailsSchema = new Schema({
  religion: String,
  category: String,
  cast: String,
  bloodGroup: String,
  emergencyContactNo: Number,
});

const employeeSchema = new Schema({
  name: {
    type: String,
    require: true,
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
      },
    ],
    default: [],
  },
  personalDetails: { type: personalDetailsSchema, default: {} },
  qualificationDetails: { type: qualificationDetailsSchema, default: {} },
  experience: [experienceSchema],
  familyDetails: [familySchema],
  otherDetails: { type: otherDetailsSchema, default: {} },
});

export default model("Employees", employeeSchema);
