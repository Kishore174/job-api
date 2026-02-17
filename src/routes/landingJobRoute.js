const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const {
  createLandingJob,
  getLandingJobs
} = require('../controllers/landingJobController');

// Admin post landing job
router.post('/', authMiddleware(['admin']), createLandingJob);

// Public landing page jobs
router.get('/', getLandingJobs);

module.exports = router;
