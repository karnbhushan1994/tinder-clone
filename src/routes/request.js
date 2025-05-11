const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const  allowOnlyFields = require('../utils/validators');
const mongoose = require('mongoose');
// Send a connection request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // ✅ Check if toUserId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // ✅ Check if the recipient user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Validate the status
    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // ✅ Prevent sending request to self
    if (userId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: 'You cannot send a connection request to yourself' });
    }

    // ✅ Check if a connection request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    // ✅ Create and save new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId: userId,
      toUserId: toUserId,
      status: status
    });

    const savedRequest = await connectionRequest.save();

    return res.status(200).json({
      message: 'Connection request sent successfully',
      data: savedRequest
    });

  } catch (err) {
    console.error('Error in sending connection request:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
  }
});

//-post /request/review/accepted/:requestId
//-post /requested/review/rejected/:requestId

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUserId = req.user._id;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID format' });
    }

    const connectionRequest = await ConnectionRequest.findById(requestId);
    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connectionRequest.status !== 'interested') {
      return res.status(400).json({ message: 'Request is not in an "interested" status' });
    }

    if (connectionRequest.toUserId.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this request' });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    return res.status(200).json({
      message: 'Connection request reviewed successfully',
      data: connectionRequest
    });

  } catch (err) {
    console.error('Error reviewing connection request:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


module.exports = requestRouter;