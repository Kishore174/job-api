"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/jobController'),
  createJob = _require.createJob,
  getJobs = _require.getJobs,
  deleteJob = _require.deleteJob;

// Admin create job
router.post('/', authMiddleware(['admin']), createJob);

// Students view jobs
router.get('/', authMiddleware(['admin', 'student']), getJobs);

// Admin delete job
router["delete"]('/:id', authMiddleware(['admin']), deleteJob);
module.exports = router;