const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { applyJob } = require('../controllers/applicationController');
const HrEmail = require('../module/hrEmail');   // ✅ ADD THIS LINE

router.post('/apply', authMiddleware(['student']), applyJob);

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
