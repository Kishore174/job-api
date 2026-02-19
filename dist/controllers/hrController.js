"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var HrEmail = require('../module/hrEmail');
exports.uploadHrEmails = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, jobId, emails, emailDocs, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, jobId = _req$body.jobId, emails = _req$body.emails;
          console.log("BODY:", req.body);
          if (!(!jobId || !emails || !emails.length)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid data"
          }));
        case 1:
          emailDocs = emails.map(function (email) {
            return {
              jobId: jobId,
              email: email
            };
          });
          _context.next = 2;
          return HrEmail.insertMany(emailDocs);
        case 2:
          res.status(201).json({
            success: true,
            message: "HR emails uploaded successfully"
          });
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](0);
          console.error("UPLOAD ERROR:", _t); // 👈 show real error
          res.status(500).json({
            success: false,
            message: _t.message
          });
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getHrEmailsByJob = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var jobId, emails, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          jobId = req.params.jobId;
          if (jobId) {
            _context2.next = 1;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Job ID is required"
          }));
        case 1:
          _context2.next = 2;
          return HrEmail.find({
            jobId: jobId
          }).sort({
            createdAt: -1
          });
        case 2:
          emails = _context2.sent;
          res.status(200).json({
            success: true,
            count: emails.length,
            emails: emails
          });
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t2 = _context2["catch"](0);
          console.error("GET HR ERROR:", _t2);
          res.status(500).json({
            success: false,
            message: _t2.message
          });
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
// 🔹 Get All HR Emails
exports.getAllHrEmails = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var emails, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 1;
          return HrEmail.find().populate("jobId", "title location") // show job info
          .sort({
            createdAt: -1
          });
        case 1:
          emails = _context3.sent;
          res.status(200).json({
            success: true,
            count: emails.length,
            emails: emails
          });
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          console.error("GET ALL HR ERROR:", _t3);
          res.status(500).json({
            success: false,
            message: _t3.message
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