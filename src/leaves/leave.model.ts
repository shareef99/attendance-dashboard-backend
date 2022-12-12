import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  eligibility: {
    type: Boolean,
    required: true,
  },
  uploadDocument: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Leaves", leaveSchema);
