"use strict";

// routes/studentRoute.js
var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/studentController'),
  createStudent = _require.createStudent;
var _require2 = require('../controllers/studentController'),
  getStudents = _require2.getStudents;
var _require3 = require('../controllers/studentController'),
  updateStudent = _require3.updateStudent;
var _require4 = require('../controllers/studentController'),
  deleteStudent = _require4.deleteStudent;
router.post('/create', authMiddleware(['admin']), createStudent);
router.get('/', authMiddleware(['admin']), getStudents);
router.put('/:id', authMiddleware(['admin']), updateStudent);
router["delete"]('/:id', authMiddleware(['admin']), deleteStudent);
module.exports = router;