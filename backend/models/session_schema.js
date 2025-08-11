import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    credits: {
      type: Number,
      required: true
    },
    rounds: [
      {
        roundId: {
          type: String,
          required: true
        },
        bet: {
          type: Number,
          required: true
        },
        result: {
          type: [String],
          required: true
        },
        win: {
          type: Boolean,
          required: true
        },
        reward: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Session", sessionSchema, "session");
