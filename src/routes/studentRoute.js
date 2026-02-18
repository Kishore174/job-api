// routes/studentRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middileware/authMiddleware');
const { createStudent } = require('../controllers/studentController');
const { getStudents } = require('../controllers/studentController');
const { updateStudent } = require('../controllers/studentController');
const { deleteStudent } = require('../controllers/studentController');

router.post('/create', authMiddleware(['admin']), createStudent);
router.get('/', authMiddleware(['admin']), getStudents);
router.put('/:id', authMiddleware(['admin']), updateStudent);
router.delete('/:id', authMiddleware(['admin']), deleteStudent);

module.exports = router;
