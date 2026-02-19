"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require('express');
var router = express.Router();
var authMiddleware = require('../middileware/authMiddleware');
var _require = require('../controllers/applicationController'),
  applyJob = _require.applyJob,
  getMyApplications = _require.getMyApplications,
  getAllApplications = _require.getAllApplications;
var HrEmail = require('../module/hrEmail'); // ✅ ADD THIS LINE

var upload = require("../middileware/uploadResume");
router.post("/apply", authMiddleware(["student"]), upload.single("resume"), applyJob);
router.get("/my", authMiddleware(["student"]), getMyApplications);
router.get("/admin/applications", authMiddleware(["admin"]), getAllApplications);
router.get("/hr/:jobId", authMiddleware(["student", "admin"]), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var hrList, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return HrEmail.find({
            jobId: req.params.jobId
          });
        case 1:
          hrList = _context.sent;
          res.json({
            success: true,
            hrList: hrList
          });
          _context.next = 3;
          break;
        case 2:
          _context.prev = 2;
          _t = _context["catch"](0);
          res.status(500).json({
            success: false,
            message: _t.message
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;