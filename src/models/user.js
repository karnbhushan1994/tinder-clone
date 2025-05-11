const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
    minlength: 2,
    maxlength: 50,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message: "Password is not strong enough",
    },
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "other"],
  },
  photoUrl: {
    type: String,
    trim: true,
    default: "https://example.com/default.jpg",
    validate: {
      validator: validator.isURL,
      message: "Photo URL must be a valid URL",
    },
  },
  skills: {
    type: [String],
    enum: ['math', 'english', 'science', 'history', 'geography'],
  },
}, {
  timestamps: true,
});

// ✅ JWT Generation Method
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Password Compare Method
userSchema.methods.validatePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// ✅ Check if Email is Taken (Static)
userSchema.statics.isEmailTaken = async function (emailId) {
  return await this.findOne({ emailId });
};

// ✅ Register the model with name "User" (case-sensitive)
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
