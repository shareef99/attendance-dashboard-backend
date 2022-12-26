import { Schema, model } from "mongoose";

const leaveSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortname: {
    type: String,
    required: true,
    unique: true,
  },
  leave_type: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
});

export default model("Leaves", leaveSchema);
