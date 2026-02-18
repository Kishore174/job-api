"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Application = require('../module/application');
var HrEmail = require('../module/hrEmail');
var Job = require('../module/job');
var User = require('../module/user');
var mongoose = require('mongoose');
var transporter = require('../config/email');
exports.applyJob = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, jobId, experience, coverLetter, selectedHr, studentId, job, alreadyApplied, student, newApplication, hrEmails, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, jobId = _req$body.jobId, experience = _req$body.experience, coverLetter = _req$body.coverLetter, selectedHr = _req$body.selectedHr;
          studentId = req.user.id; // 1️⃣ Validate Required Fields
          if (!(!jobId || !experience || !coverLetter)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "All fields are required"
          }));
        case 1:
          if (mongoose.Types.ObjectId.isValid(jobId)) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid Job ID"
          }));
        case 2:
          _context.next = 3;
          return Job.findById(jobId);
        case 3:
          job = _context.sent;
          if (job) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Job not found"
          }));
        case 4:
          _context.next = 5;
          return Application.findOne({
            studentId: studentId,
            jobId: jobId
          });
        case 5:
          alreadyApplied = _context.sent;
          if (!alreadyApplied) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "You have already applied for this job"
          }));
        case 6:
          _context.next = 7;
          return User.findById(studentId).select("-password");
        case 7:
          student = _context.sent;
          if (student) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Student not found"
          }));
        case 8:
          // 6️⃣ Save Application
          newApplication = new Application({
            studentId: studentId,
            jobId: jobId,
            experience: experience,
            coverLetter: coverLetter
          });
          _context.next = 9;
          return newApplication.save();
        case 9:
          _context.next = 10;
          return HrEmail.find({
            jobId: jobId
          });
        case 10:
          hrEmails = _context.sent;
          if (hrEmails.length) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: "Application saved (No HR emails linked)"
          }));
        case 11:
          _context.next = 12;
          return Promise.all(hrEmails.map(function (hr) {
            return transporter.sendMail({
              from: "\"".concat(student.username, "\" <").concat(process.env.EMAIL_USER, ">"),
              // 👈 shows student name
              to: hr.email,
              replyTo: student.email,
              // 👈 HR reply goes to student
              cc: student.email,
              // 👈 student gets copy
              subject: "Application for ".concat(job.title),
              html: "\n        <div style=\"font-family: Arial, sans-serif; padding: 15px;\">\n          <h2 style=\"color:#2BB5CE;\">New Job Application</h2>\n\n          <p><strong>Job Title:</strong> ".concat(job.title, "</p>\n          <p><strong>Candidate Name:</strong> ").concat(student.username, "</p>\n          <p><strong>Candidate Email:</strong> ").concat(student.email, "</p>\n          <p><strong>Experience:</strong> ").concat(experience, "</p>\n\n          <h4>Cover Letter:</h4>\n          <div style=\"background:#f4f4f4; padding:12px; border-radius:6px;\">\n            ").concat(coverLetter, "\n          </div>\n\n          <hr style=\"margin-top:20px;\" />\n\n          <p style=\"font-size:12px; color:gray;\">\n            This email was sent via Job Portal System.\n          </p>\n        </div>\n      ")
            });
          }));
        case 12:
          return _context.abrupt("return", res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            hrCount: hrEmails.length
          }));
        case 13:
          _context.prev = 13;
          _t = _context["catch"](0);
          console.error("Apply Job Error:", _t);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Something went wrong while applying"
          }));
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 13]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();