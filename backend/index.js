import express from "express"; 
import mongoose from "mongoose";
import userScheme from "./models/user_model.js"
import sessionSchema from "./models/session_schema.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { registerValidation } from "./validators/auth_validation.js"
import { validationResult } from "express-validator";
const app = express();
const PORT = 8989;

app.use(express.json());

mongoose.connect("mongodb+srv://admin1:admin@cluster0.oceaqdv.mongodb.net/")
  .then(() => console.log("BD is available"))
  .catch((err) => {
    console.log(err);
  });

app.get("/api/users", async (req,res)=>{
  try {
    const users = await userScheme.find();
    res.json(users);
  } 
  catch (err) {
    console.log(err);
    return res.status(404);
  }
})

app.get("/api/users/:id", async (req,res)=>{
  try {
    const userId = req.params.id;
    const user = await userScheme.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json(user);
  } 
  catch (err) {
    console.log(err);
    return res.status(404);
  }
})

app.get("/api/sessions/user/:id", async (req,res)=>{
  try {
    const userId = req.params.id;
    const user = await userScheme.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Error" });
    }
    const session = await  sessionSchema.find({userId: userId})
    res.json(session);
  } 
  catch (err) {
    console.log(err);
    return res.status(404);
  }
})

app.post("/api/auth/registration",registerValidation,async (req, res) => {
    try { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const existingUser = await userScheme.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Користувач з таким email вже існує" });
      }
  
      const password = req.body.passwordHash;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const doc = new userScheme({
        name: req.body.name,
        email: req.body.email,
        passwordHash: hash,
        creditScore: req.body.creditScore
      });
  
      const user = await doc.save();
  
      const { passwordHash, ...userData } = user._doc;
  
      const token = jwt.sign(
        { _id: user._id },
        'casino_secret_phrase', 
        { expiresIn: '1d' } 
      );
  
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
})

app.post("/api/auth/login", async (req,res)=>{
    try {
      const user = await userScheme.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({
          message: "Wrong login/password"
        });
      }
  
     const isValidPass = await bcrypt.compare(req.body.passwordHash, user.passwordHash);

      if (!isValidPass) {
        console.log("Хеш з бази:", user._doc.passwordHash);
console.log("Пароль з форми:", req.body.passwordHash);
        return res.status(403).json({
          message: "Wrong login/password"
        });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        'casino_secret_phrase', 
        { expiresIn: '1d' } 
      );
      
      const {passwordHash, ...userData} = user._doc
      

      res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

      res.json({
        ...userData,
        token,
        
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "authorization failed" });
    } 
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 