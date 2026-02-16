const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { uploadHrEmails } = require('../controllers/hrController');

router.post('/upload', authMiddleware(['admin']), uploadHrEmails);

module.exports = router;
