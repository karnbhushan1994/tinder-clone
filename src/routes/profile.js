const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/auth");
const { allowOnlyFields } = require("../utils/validators");

profileRouter.get("/profile", userAuth, (req, res) => {
  const { password, ...userData } = req.user.toObject();
  res.status(200).json({ message: "Authorized", user: userData });
});

profileRouter.patch("/edit",userAuth,allowOnlyFields(["firstName", "emailId", "gender"]),async (req, res) => {
    const userId = req.user._id;
    const updates = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = profileRouter;
