const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["interested", "ignored","accepted", "rejected"],
    required: true,
  },
}, {
  timestamps: true,
});

// ✅ Unique compound index (one direction)
connectionRequestSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);

// ✅ Optional: reverse direction index
connectionRequestSchema.index(
  { toUserId: 1, fromUserId: 1 },
  { unique: false } // not enforcing uniqueness again, just for lookup performance
);

// ✅ Index on status for potential filtering
connectionRequestSchema.index({ status: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
