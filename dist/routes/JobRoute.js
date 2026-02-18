"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/jobController'),
  createJob = _require.createJob,
  getJobs = _require.getJobs,
  deleteJob = _require.deleteJob,
  getPremiumJobs = _require.getPremiumJobs;

// 🔹 Create Job (Admin)
router.post('/', authMiddleware(['admin']), createJob);

// 🔹 Get All Jobs (Admin)
router.get('/', authMiddleware(['admin']), getJobs);

// 🔹 Get Premium Jobs (Student + Admin)
router.get('/premium', authMiddleware(['admin', 'student']), getPremiumJobs);

// 🔹 Delete Job (Admin)
router["delete"]('/:id', authMiddleware(['admin']), deleteJob);
module.exports = router;