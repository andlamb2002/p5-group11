"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: "Jane" }, 
  last_name: { type: String, default: "Doe" },
  location: { type: String, default: "New York, NY" },
  description: { type: String, default: "Photography enthusiast" },
  occupation: { type: String, default: "Software Engineer" },
  login_name: { type: String, required: true }, 
  password: { type: String, required: true } ,
  photosCount: {type: Number, default: 0 } ,
  commentsCount: { type: Number, default: 0 },
  commentedPhotos: { type: Array, default: [] }
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;
