const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { applyJob, getMyApplications, getAllApplications } = require('../controllers/applicationController');
const HrEmail = require('../module/hrEmail');   // ✅ ADD THIS LINE

const upload = require("../middileware/uploadResume");
router.post(
  "/apply",
  authMiddleware(["student"]),
  upload.single("resume"),
  applyJob
);
router.get(
  "/my",
  authMiddleware(["student"]),
  getMyApplications
);
router.get(
  "/admin/applications",
  authMiddleware(["admin"]),
  getAllApplications
);

router.get(
  "/hr/:jobId",
  authMiddleware(["student","admin"]),
  async (req, res) => {
    try {
      const hrList = await HrEmail.find({
        jobId: req.params.jobId
      });

      res.json({
        success: true,
        hrList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
