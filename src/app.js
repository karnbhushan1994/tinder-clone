const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user"); // Import the UserModel

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log("User signed up");
  const user = new User(req.body); // creating new instance of user model
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

app.get("/user", async (req, res) => {
  const email = req.query.emailId; // GET requests should use query parameters
  console.log(email);
  try {
    const foundUser = await User.findOne({ emailId: email });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: foundUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
});



app.get("/feed", async (req, res) => {
  try {
    const foundUser = await User.find(); // Fetch all users from the database

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: foundUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const foundUser = await User.findOneAndDelete({ _id: userId });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user: foundUser,
    }); 
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user", error });
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const updateData = req.body.updateData; // Assuming updateData is an object with the fields to update

  try {
    const foundUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: foundUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error });
  }
});

connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
