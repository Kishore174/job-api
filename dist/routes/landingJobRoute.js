"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/landingJobController'),
  createLandingJob = _require.createLandingJob,
  getLandingJobs = _require.getLandingJobs;

// Admin post landing job
router.post('/', authMiddleware(['admin']), createLandingJob);

// Public landing page jobs
router.get('/', getLandingJobs);
module.exports = router;