const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Get token from cookie or Authorization header (Bearer token)
  const token = req.cookies.jwt_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = userAuth;
