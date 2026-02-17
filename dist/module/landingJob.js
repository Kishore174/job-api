"use strict";

var mongoose = require('mongoose');
var landingJobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  type: {
    type: String,
    "enum": ['Full Time', 'Remote', 'Internship'],
    required: true
  },
  // 🔥 New Field
  applyLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('LandingJob', landingJobSchema);