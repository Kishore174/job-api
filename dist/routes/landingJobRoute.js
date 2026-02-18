"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/landingJobController'),
  createLandingJob = _require.createLandingJob,
  getLandingJobs = _require.getLandingJobs,
  updateLandingJob = _require.updateLandingJob,
  deleteLandingJob = _require.deleteLandingJob;

// Admin post landing job
router.post('/', authMiddleware(['admin']), createLandingJob);

// Public landing page jobs
router.get('/', getLandingJobs);
router.put('/:id', authMiddleware(['admin']), updateLandingJob);
router["delete"]('/:id', authMiddleware(['admin']), deleteLandingJob);
module.exports = router;