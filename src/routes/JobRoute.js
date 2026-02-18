const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const {
  createJob,
  getJobs,
  deleteJob,
  getPremiumJobs
} = require('../controllers/jobController');

// 🔹 Create Job (Admin)
router.post('/', authMiddleware(['admin']), createJob);

// 🔹 Get All Jobs (Admin)
router.get('/', authMiddleware(['admin']), getJobs);

// 🔹 Get Premium Jobs (Student + Admin)
router.get(
  '/premium',
  authMiddleware(['admin', 'student']),
  getPremiumJobs
);

// 🔹 Delete Job (Admin)
router.delete('/:id', authMiddleware(['admin']), deleteJob);

module.exports = router;
