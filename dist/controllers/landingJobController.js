"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var LandingJob = require('../module/landingJob');

// Admin create landing job
exports.createLandingJob = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var job, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          job = new LandingJob(req.body);
          _context.next = 1;
          return job.save();
        case 1:
          res.status(201).json({
            success: true,
            message: "Landing job created",
            job: job
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
}();

// Public fetch for landing page
exports.getLandingJobs = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var jobs, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return LandingJob.find({
            isActive: true
          }).sort({
            createdAt: -1
          });
        case 1:
          jobs = _context2.sent;
          res.status(200).json({
            success: true,
            jobs: jobs
          });
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch landing jobs"
          });
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();