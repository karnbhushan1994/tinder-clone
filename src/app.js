const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user"); // Import the UserModel

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log("User signed up");
  const user = new User({
    firstName: "karan",
    lastName: "karan yadav",
    emailId: "karn.becs.13@gmail.com",
    password: "W0rk@home",
    gender: "male",
    age: "10",
  });
  // creating new instance of user model
  try {
    await user.save();
    // saving the user to the database
    res.status(201).json({
      message: "User created successfully",
      user: user, // return the user object
    });
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(400).json({ message: "Validation error", error });
  }
});

connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
