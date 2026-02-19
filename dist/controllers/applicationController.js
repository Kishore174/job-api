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
    var _req$body, jobId, experience, coverLetter, selectedHr, studentId, resumeFile, job, alreadyApplied, student, newApplication, hrEmails, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, jobId = _req$body.jobId, experience = _req$body.experience, coverLetter = _req$body.coverLetter, selectedHr = _req$body.selectedHr;
          studentId = req.user.id;
          resumeFile = req.file; // ================= VALIDATIONS =================
          if (!(!jobId || !experience || !coverLetter)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "All fields are required"
          }));
        case 1:
          if (resumeFile) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Resume file is required"
          }));
        case 2:
          if (mongoose.Types.ObjectId.isValid(jobId)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid Job ID"
          }));
        case 3:
          _context.next = 4;
          return Job.findById(jobId);
        case 4:
          job = _context.sent;
          if (job) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Job not found"
          }));
        case 5:
          _context.next = 6;
          return Application.findOne({
            studentId: studentId,
            jobId: jobId
          });
        case 6:
          alreadyApplied = _context.sent;
          if (!alreadyApplied) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "You already applied for this job"
          }));
        case 7:
          _context.next = 8;
          return User.findById(studentId).select("-password");
        case 8:
          student = _context.sent;
          if (student) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Student not found"
          }));
        case 9:
          _context.next = 10;
          return Application.create({
            studentId: studentId,
            jobId: jobId,
            experience: experience,
            coverLetter: coverLetter,
            selectedHr: selectedHr,
            resume: resumeFile.originalname // store filename only
          });
        case 10:
          newApplication = _context.sent;
          _context.next = 11;
          return HrEmail.find({
            jobId: jobId
          });
        case 11:
          hrEmails = _context.sent;
          if (!(hrEmails.length > 0)) {
            _context.next = 12;
            break;
          }
          _context.next = 12;
          return Promise.all(hrEmails.map(function (hr) {
            return transporter.sendMail({
              from: "\"Job Portal\" <".concat(process.env.EMAIL_USER, ">"),
              to: hr.email,
              replyTo: student.email,
              cc: student.email,
              subject: "New Application: ".concat(student.username, " applied for ").concat(job.title),
              attachments: [{
                filename: resumeFile.originalname,
                content: resumeFile.buffer,
                contentType: resumeFile.mimetype
              }],
              html: "\n              <div style=\"font-family:Arial;background:#f4f6f8;padding:30px;\">\n                <div style=\"max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;\">\n                  \n                  <div style=\"background:#2BB5CE;padding:20px;color:#fff;text-align:center;\">\n                    <h2 style=\"margin:0;\">New Job Application</h2>\n                  </div>\n\n                  <div style=\"padding:25px;\">\n                    <h3>Job Details</h3>\n                    <p><strong>Job Title:</strong> ".concat(job.title, "</p>\n\n                    <hr style=\"margin:20px 0;\"/>\n\n                    <h3>Candidate Information</h3>\n                    <p><strong>Name:</strong> ").concat(student.username, "</p>\n                    <p><strong>Email:</strong> ").concat(student.email, "</p>\n                    <p><strong>Experience:</strong> ").concat(experience, "</p>\n\n                    <div style=\"margin-top:20px;\">\n                      <strong>Cover Letter:</strong>\n                      <div style=\"background:#f9f9f9;padding:15px;border-radius:6px;\">\n                        ").concat(coverLetter, "\n                      </div>\n                    </div>\n\n                    <div style=\"margin-top:20px;background:#e8f6f9;padding:12px;border-radius:6px;\">\n                      \uD83D\uDCCE Resume is attached with this email.\n                    </div>\n                  </div>\n\n                  <div style=\"background:#f4f6f8;padding:15px;text-align:center;font-size:12px;\">\n                    This email was automatically generated by Job Portal.\n                  </div>\n\n                </div>\n              </div>\n            ")
            });
          }));
        case 12:
          return _context.abrupt("return", res.status(201).json({
            success: true,
            message: "Application submitted successfully"
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
exports.getMyApplications = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var studentId, applications, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          studentId = req.user.id;
          _context2.next = 1;
          return Application.find({
            studentId: studentId
          }).select("jobId").lean();
        case 1:
          applications = _context2.sent;
          res.status(200).json({
            success: true,
            applications: applications
          });
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          console.error("Get My Applications Error:", _t2);
          res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
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

// GET ALL APPLICATIONS (Admin)
exports.getAllApplications = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var applications, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 1;
          return Application.find().populate("studentId", "username email").populate("jobId", "title location").sort({
            createdAt: -1
          });
        case 1:
          applications = _context3.sent;
          res.status(200).json({
            success: true,
            applications: applications
          });
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          console.error("Admin Get Applications Error:", _t3);
          res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
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