"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/hrController'),
  uploadHrEmails = _require.uploadHrEmails,
  getHrEmailsByJob = _require.getHrEmailsByJob,
  getAllHrEmails = _require.getAllHrEmails;

// Upload HR Emails
router.post('/upload', authMiddleware(['admin']), uploadHrEmails);

// Get HR emails by job
router.get('/:jobId', authMiddleware(['admin']), getHrEmailsByJob);

// Get all HR emails
router.get('/', authMiddleware(['admin']), getAllHrEmails);
module.exports = router;