const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  try {
    const existingUser = await User.isEmailTaken(emailId);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User created successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: "Validation error", error });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    console.log("Generated token:", token);
    res.cookie("jwt_token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: false,
      sameSite: "Strict",
    });

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt_token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = authRouter;
