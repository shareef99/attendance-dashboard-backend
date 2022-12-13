import mongoose from "mongoose";

const designationModel = new mongoose.Schema({
  type: {
    type: String,
    enum: ["teaching", "non-teaching"],
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  role: {
    type: Number,
    require: true,
  },
});

export default mongoose.model("designation", designationModel);
