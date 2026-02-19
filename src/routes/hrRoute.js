const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');

const {
  uploadHrEmails,
  getHrEmailsByJob,
  getAllHrEmails
} = require('../controllers/hrController');

// Upload HR Emails
router.post('/upload', authMiddleware(['admin']), uploadHrEmails);

// Get HR emails by job
router.get('/:jobId', authMiddleware(['admin']), getHrEmailsByJob);

// Get all HR emails
router.get('/', authMiddleware(['admin']), getAllHrEmails);

module.exports = router;
