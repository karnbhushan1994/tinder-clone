const mongoose = require("mongoose");
const validator = require("validator");

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
    required: true,
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: "At least one skill must be selected",
    },
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
