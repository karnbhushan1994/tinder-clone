const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");
require("dotenv").config();
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Catch bad JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  next();
});


app.use("/api/auth", authRouter);
app.use("/api/request", userAuth, requestRouter);
app.use("/api/profile", userAuth, profileRouter);
app.use("/api/user", userAuth, userRouter);


connectDB();
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
