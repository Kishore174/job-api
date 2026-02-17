const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const {
  createLandingJob,
  getLandingJobs,
  updateLandingJob,
  deleteLandingJob
} = require('../controllers/landingJobController');

// Admin post landing job
router.post('/', authMiddleware(['admin']), createLandingJob);

// Public landing page jobs
router.get('/', getLandingJobs);

// router.put('/:id', authMiddleware(['admin']), updateLandingJob);
// router.delete('/:id', authMiddleware(['admin']), deleteLandingJob);

module.exports = router;
