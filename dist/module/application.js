"use strict";

var mongoose = require('mongoose');
var applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String // Later we store file path or cloud URL
  },
  status: {
    type: String,
    "enum": ['sent', 'viewed', 'shortlisted', 'rejected'],
    "default": 'sent'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Application', applicationSchema);