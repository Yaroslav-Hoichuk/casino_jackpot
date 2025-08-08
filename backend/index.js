import express from "express"; 
import { registerValidation } from "./validators/auth_validation.js"
import { Cashout, getUserById, getUsers, Spin, userLogin, userRegistration } from "./controllers/user_controller.js";
import { getAllSessions, getUserSessionsById, createSession, deleteSessionById, deleteAllUserSessions} from "./controllers/session_controller.js";
import dotenv from 'dotenv';
import { dbConnection } from "./connections/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
dbConnection(process.env.MONGO_URI)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());


app.get("/api/users/", getUsers);
app.get("/api/users/:id", getUserById)
app.get("/api/sessions/user/:id", getUserSessionsById)
app.get("/", getAllSessions);

app.post("/api/auth/registration", registerValidation, userRegistration)
app.post("/api/auth/login", userLogin)
app.post("/api/users/:id/spin", Spin)
app.post("/api/sessions/new/", createSession);

app.put("/api/users/:id/cashout", Cashout)
app.delete("/api/sessions/user/", deleteSessionById);
app.delete("/api/sessions/user/:id", deleteAllUserSessions);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
}); 