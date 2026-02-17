"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/applicationController'),
  applyJob = _require.applyJob;
router.post('/apply', authMiddleware(['student']), applyJob);
module.exports = router;