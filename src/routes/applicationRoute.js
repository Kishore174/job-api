const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { applyJob } = require('../controllers/applicationController');

router.post('/apply', authMiddleware(['student']), applyJob);

module.exports = router;
