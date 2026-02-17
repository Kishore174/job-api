"use strict";

// src/routes/authRoute.js
var express = require('express');
var router = express.Router();
var _require = require('../controllers/authController'),
  register = _require.register,
  login = _require.login,
  getDashboardData = _require.getDashboardData;
router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', getDashboardData);
module.exports = router;