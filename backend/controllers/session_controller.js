import sessionSchema from "../models/session_schema.js";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"
import userScheme from "../models/user_model.js"
// 1. Get all sessions (admin only)
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionSchema.find();
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Create a new session (e.g., on login)
export const createSession = async (req, res) => {
  try {    
    const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: "Not authorized" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userScheme.findById(decoded.userId).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
    
     const session = await sessionSchema.create({
      sessionId: uuidv4(),        // генеруємо унікальний ID
      userId: user._id,
      credits: user.creditScore,
      rounds: [],
    });

    res.cookie("sessionId", session.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 20 * 60 * 1000
    });

      console.log(session)
      res.json({ session });
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: "Not authorized" });
    }
}

// 2. Delete a specific session (logout)
export const deleteSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const deleted = await sessionSchema.findByIdAndDelete(sessionId);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Delete all sessions of a specific user
export const deleteAllUserSessions = async (req, res) => {
  try {
    const userId = req.params.id;
    await sessionSchema.deleteMany({ userId });
    res.status(200).json({ message: "All user sessions deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
