
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    contactNumber: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);