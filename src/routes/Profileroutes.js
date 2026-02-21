// routes/profile.js

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/Profilecontroller');
const auth    = require('../middileware/authMiddleware');   // your existing JWT middleware

// GET  /profile/me             → fetch logged-in user's profile
// PUT  /profile/update         → update text fields
// POST /profile/upload-resume  → upload resume file
// POST /profile/upload-avatar  → upload avatar image

router.get('/me', auth(["student", "admin"]), ctrl.getMyProfile);
router.put('/update',         auth(["student", "admin"]), ctrl.updateProfile);
router.post('/upload-resume', auth(["student", "admin"]), ctrl.uploadResume,  ctrl.uploadResumeFile);
router.post('/upload-avatar', auth(["student", "admin"]), ctrl.uploadAvatar,  ctrl.uploadAvatarFile);

module.exports = router;

// ── Register in app.js / server.js ───────────────────────────
// const profileRoutes = require('./routes/profile');
// app.use('/profile', profileRoutes);