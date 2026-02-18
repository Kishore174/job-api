"use strict";

var mongoose = require('mongoose');
var jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  experienceRequired: String,
  isPremium: {
    type: Boolean,
    "default": false
  },
  // 👈 ADD THIS
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Job', jobSchema);