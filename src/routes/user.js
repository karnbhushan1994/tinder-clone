const express = require("express");
const userRouter = express.Router();

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userAuth = require("../middlewares/auth");
const allowOnlyFields = require("../utils/validators");
const mongoose = require("mongoose");

userRouter.get("/requests/recived", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // ✅ Check if loggedInUserId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    console.log("Logged in user ID:", loggedInUserId);
    // ✅ Fetch all connection requests for the logged-in user

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({ message: "No connection requests found" });
    }

    return res.status(200).json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

userRouter.get("/connection", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const acceptedConnections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).populate("fromUserId", ["firstName", "lastName"]);
  if (!acceptedConnections || acceptedConnections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }
 // give only the userId and name of the other user

    const data = acceptedConnections.map(row=>row.fromUserId)

    res.status(200).json({
      message: "Connections fetched successfully",
      data: data,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
