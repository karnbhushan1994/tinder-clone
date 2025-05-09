const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  photoUrl:{
    type: String,
    required: true,
    trim: true,
    default: "https://example.com/default.jpg",
  },
  skills: {
    type: [String], // Array of strings
    enum: ['math', 'english', 'science', 'history', 'geography'],
    required: true,
  }  
},{
  timestamps: true,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
