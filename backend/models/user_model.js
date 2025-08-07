import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
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

userScheme.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
 
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userScheme.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userScheme, "user");
