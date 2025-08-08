import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
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
          type: Number,
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
        },
        rerolled: {
          type: Boolean,
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
