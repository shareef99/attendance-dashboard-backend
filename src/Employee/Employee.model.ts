import mongoose from "mongoose";

const personalDetailsSchema = new mongoose.Schema({
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

const qualificationDetailsSchema = new mongoose.Schema({
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

const experienceSchema = new mongoose.Schema({
  institute: String,
  type: String,
  from: Date,
  to: Date,
  designation: String,
  subjects: [String],
  salary: Number,
});

const familySchema = new mongoose.Schema({
  memberName: String,
  relation: String,
  dob: Date,
  age: Number,
  aadharNo: Number,
  insuranceName: String,
  insuranceNo: String,
});

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
  personalDetails: personalDetailsSchema,
  qualificationDetails: qualificationDetailsSchema,
  experience: [experienceSchema],
  familyDetails: [familySchema],
});

export default mongoose.model("Employees", employeeSchema);
