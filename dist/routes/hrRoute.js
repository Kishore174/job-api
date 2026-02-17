"use strict";

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/hrController'),
  uploadHrEmails = _require.uploadHrEmails;
router.post('/upload', authMiddleware(['admin']), uploadHrEmails);
module.exports = router;