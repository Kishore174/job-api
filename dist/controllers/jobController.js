"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Job = require('../module/job');

// 🔹 Create Job (Admin Only)
exports.createJob = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, title, description, location, experienceRequired, newJob, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location, experienceRequired = _req$body.experienceRequired;
          newJob = new Job({
            title: title,
            description: description,
            location: location,
            experienceRequired: experienceRequired,
            createdBy: req.user.id
          });
          _context.next = 1;
          return newJob.save();
        case 1:
          res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: newJob
          });
          _context.next = 3;
          break;
        case 2:
          _context.prev = 2;
          _t = _context["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to create job"
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

// 🔹 Get All Jobs (Student View)
exports.getJobs = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var jobs, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return Job.find().sort({
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
            message: "Failed to fetch jobs"
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

// 🔹 Delete Job (Admin Only)
exports.deleteJob = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var id, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 1;
          return Job.findByIdAndDelete(id);
        case 1:
          res.status(200).json({
            success: true,
            message: "Job deleted successfully"
          });
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to delete job"
          });
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();