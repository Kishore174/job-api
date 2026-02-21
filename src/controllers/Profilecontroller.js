// controllers/profileController.js
// npm install cloudinary multer multer-storage-cloudinary dotenv

const User       = require('../module/user');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer     = require('multer');

// ── Cloudinary config (add to .env) ───────────────────────────
// CLOUDINARY_CLOUD_NAME=xxx
// CLOUDINARY_API_KEY=xxx
// CLOUDINARY_API_SECRET=xxx
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer storage for resumes ─────────────────────────────────
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'job-portal/resumes',
    resource_type: 'raw',                    // raw = non-image files
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

// ── Multer storage for avatars ─────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'job-portal/avatars',
    resource_type:   'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

exports.uploadResume = multer({ storage: resumeStorage }).single('resume');
exports.uploadAvatar = multer({ storage: avatarStorage }).single('avatar');

// ── GET /profile/me ────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, profile: user.profile, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /profile/update ────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, location, bio, skills,
            experience, education, linkedin, github, portfolio } = req.body;

    // skills comes as JSON string from multipart/form-data
    const parsedSkills = typeof skills === 'string'
      ? JSON.parse(skills)
      : skills || [];

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Merge updates into profile subdoc
    user.profile = {
      ...user.profile.toObject(),
      fullName:   fullName   ?? user.profile.fullName,
      phone:      phone      ?? user.profile.phone,
      location:   location   ?? user.profile.location,
      bio:        bio        ?? user.profile.bio,
      skills:     parsedSkills.length ? parsedSkills : user.profile.skills,
      experience: experience ?? user.profile.experience,
      education:  education  ?? user.profile.education,
      linkedin:   linkedin   ?? user.profile.linkedin,
      github:     github     ?? user.profile.github,
      portfolio:  portfolio  ?? user.profile.portfolio,
    };

    // Mark profile complete if core fields are filled
    const p = user.profile;
    user.profile.isComplete = !!(p.fullName && p.phone && p.skills.length && p.resumeUrl);

    await user.save();
    res.json({ success: true, message: 'Profile updated', profile: user.profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /profile/upload-resume ────────────────────────────────
exports.uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profile.resumeUrl  = req.file.path;          // Cloudinary secure URL
    user.profile.resumeName = req.file.originalname;
    await user.save();

    res.json({ success: true, resumeUrl: req.file.path, resumeName: req.file.originalname });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /profile/upload-avatar ────────────────────────────────
exports.uploadAvatarFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old avatar from Cloudinary if exists
    if (user.profile.avatar) {
      const publicId = user.profile.avatar.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`job-portal/avatars/${publicId}`).catch(() => {});
    }

    user.profile.avatar = req.file.path;
    await user.save();

    res.json({ success: true, avatar: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};