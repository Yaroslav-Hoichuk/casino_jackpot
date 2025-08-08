import sessionSchema from "../models/session_schema.js";

// 1. Get all sessions (admin only)
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionSchema.find();
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/*
// 2. Create a new session (e.g., on login)
export const createSession = async (req, res) => {
  try {
    const { userId, userAgent, ip } = req.body;
    const user = await userScheme.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newSession = await sessionSchema.create({
      userId,
      userAgent: userAgent || req.headers['user-agent'], // Detect user agent if not provided
      ip: ip || req.ip, // Detect IP if not provided
      createdAt: new Date()
    });

    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Delete a specific session (logout)
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

// 4. Delete all sessions of a specific user
export const deleteAllUserSessions = async (req, res) => {
  try {
    const userId = req.params.id;
    await sessionSchema.deleteMany({ userId });
    res.status(200).json({ message: "All user sessions deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/
