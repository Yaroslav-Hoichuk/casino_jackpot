import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    creditScore: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);


export default mongoose.model("User", userScheme, "user");
