"use strict";

var mongoose = require('mongoose');
var hrEmailSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('HrEmail', hrEmailSchema);