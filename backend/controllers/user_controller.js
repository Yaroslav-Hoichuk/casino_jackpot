import userScheme from "../models/user_model.js"
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const getUsers = async (req,res)=>{
  try {
    const users = await userScheme.find();
    res.json(users);
  } 
  catch (err) {
    console.log(err);
    return res.status(404);
  }
}

export const getUserById = async (req,res)=>{
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
}

export const userRegistration = async (req, res) => {
       try { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json(errors.array());
      }
      const existingUser = await userScheme.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(401).json({ message: "Користувач з таким email вже існує" });
      }
  
      const password = req.body.password;
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
        process.env.JWT_SECRET, 
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
}

export const userLogin = async (req,res)=>{
     try {
      const user = await userScheme.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({
          message: "Wrong login/password"
        });
      }
  
     const isValidPass = await bcrypt.compare(req.body.passwordHash, user.passwordHash);

      if (!isValidPass) {

        return res.status(403).json({
          message: "Wrong login/password"
        });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, 
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
}

export const Cashout = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await userScheme.updateOne(
      { _id: userId },
      { creditScore: 0 }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Cashout successful, balance reset to 0" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const Spin = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded._id;

    const user = await userScheme.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.creditScore <= 0) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    let result = spinOnce();
    let win = isWin(result);
    let payout = win ? getPayout(result[0]) : -1;

    const creditsBeforeSpin = user.creditScore;
    if (win && creditsBeforeSpin >= 40) {
      let cheatChance = 0;
      if (creditsBeforeSpin >= 40 && creditsBeforeSpin < 60) cheatChance = 0.3;
      if (creditsBeforeSpin >= 60) cheatChance = 0.6;

      if (Math.random() < cheatChance) {
        result = spinOnce();
        win = isWin(result);
        payout = win ? getPayout(result[0]) : -1;
      }
    }

    // 6. Оновлюємо баланс
    user.creditScore += payout;
    await user.save();

    // 7. Відповідь клієнту
    return res.status(200).json({
      result,
      win,
      payout,
      credits: user.creditScore
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const SYMBOLS = ['C', 'L', 'O', 'W'];
const PAYOUTS = { C: 10, L: 20, O: 30, W: 40 };

function spinOnce() {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  ];
}

function isWin(result) {
  return result[0] === result[1] && result[1] === result[2];
}

function getPayout(symbol) {
  return PAYOUTS[symbol] || 0;
}
