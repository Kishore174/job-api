// module/user.js  — updated User model with profile fields

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin', 'student'], default: 'student' },

  // ── Profile ────────────────────────────────────────────────
  profile: {
    fullName:    { type: String, default: "" },
    phone:       { type: String, default: "" },
    location:    { type: String, default: "" },
    bio:         { type: String, default: "" },
    skills:      { type: [String], default: [] },          // ["React", "Node.js", …]
    experience:  { type: String, default: "" },            // free-text summary
    education:   { type: String, default: "" },
    linkedin:    { type: String, default: "" },
    github:      { type: String, default: "" },
    portfolio:   { type: String, default: "" },
    resumeUrl:   { type: String, default: "" },            // Cloudinary / S3 URL
    resumeName:  { type: String, default: "" },            // original file name
    avatar:      { type: String, default: "" },            // profile picture URL
    isComplete:  { type: Boolean, default: false },        // handy flag for UI
  },
  // ── Job tracking ──────────────────────────────────────────
  dailyApplyCount: { type: Number, default: 0 },
  lastApplyDate:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);