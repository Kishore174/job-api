const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { createJob, getJobs, deleteJob } = require('../controllers/jobController');


// Admin create job
router.post('/', authMiddleware(['admin']), createJob);

// Students view jobs
router.get('/', authMiddleware(['admin', 'student']), getJobs);

// Admin delete job
router.delete('/:id', authMiddleware(['admin']), deleteJob);

module.exports = router;
