import mongoose from "mongoose";

const QualificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    completionDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Qualification", QualificationSchema);