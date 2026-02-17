"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var Application = require('../module/application');
var HrEmail = require('../module/hrEmail');
var Job = require('../module/job');
var User = require('../module/user');
var mongoose = require('mongoose');
var transporter = require('../config/email');
exports.applyJob = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, jobId, experience, coverLetter, studentId, job, alreadyApplied, student, newApplication, hrEmails, _iterator, _step, hr, _t, _t2;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, jobId = _req$body.jobId, experience = _req$body.experience, coverLetter = _req$body.coverLetter;
          studentId = req.user.id; // Validate Job ID
          if (mongoose.Types.ObjectId.isValid(jobId)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid Job ID"
          }));
        case 1:
          _context.next = 2;
          return Job.findById(jobId);
        case 2:
          job = _context.sent;
          if (job) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Job not found"
          }));
        case 3:
          _context.next = 4;
          return Application.findOne({
            studentId: studentId,
            jobId: jobId
          });
        case 4:
          alreadyApplied = _context.sent;
          if (!alreadyApplied) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Already applied to this job"
          }));
        case 5:
          _context.next = 6;
          return User.findById(studentId);
        case 6:
          student = _context.sent;
          // Save application
          newApplication = new Application({
            studentId: studentId,
            jobId: jobId,
            experience: experience,
            coverLetter: coverLetter
          });
          _context.next = 7;
          return newApplication.save();
        case 7:
          _context.next = 8;
          return HrEmail.find({
            jobId: jobId
          });
        case 8:
          hrEmails = _context.sent;
          // Send email to each HR
          _iterator = _createForOfIteratorHelper(hrEmails);
          _context.prev = 9;
          _iterator.s();
        case 10:
          if ((_step = _iterator.n()).done) {
            _context.next = 12;
            break;
          }
          hr = _step.value;
          _context.next = 11;
          return transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: hr.email,
            subject: "New Application for ".concat(job.title),
            html: "\n          <h3>New Job Application</h3>\n          <p><strong>Job:</strong> ".concat(job.title, "</p>\n          <p><strong>Candidate Name:</strong> ").concat(student.username, "</p>\n          <p><strong>Experience:</strong> ").concat(experience, "</p>\n          <p><strong>Cover Letter:</strong></p>\n          <p>").concat(coverLetter, "</p>\n        ")
          });
        case 11:
          _context.next = 10;
          break;
        case 12:
          _context.next = 14;
          break;
        case 13:
          _context.prev = 13;
          _t = _context["catch"](9);
          _iterator.e(_t);
        case 14:
          _context.prev = 14;
          _iterator.f();
          return _context.finish(14);
        case 15:
          res.status(201).json({
            success: true,
            message: "Application submitted & Emails sent",
            hrCount: hrEmails.length
          });
          _context.next = 17;
          break;
        case 16:
          _context.prev = 16;
          _t2 = _context["catch"](0);
          console.error("Apply Error:", _t2);
          res.status(500).json({
            success: false,
            message: _t2.message
          });
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 16], [9, 13, 14, 15]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();