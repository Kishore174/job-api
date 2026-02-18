"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// controllers/studentController.js
var User = require('../module/user');
var bcrypt = require('bcryptjs');
var transporter = require('../config/email');
exports.createStudent = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, username, email, existingUser, randomPassword, hashedPassword, newStudent, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email;
          if (!(!username || !email)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Username and Email are required"
          }));
        case 1:
          _context.next = 2;
          return User.findOne({
            $or: [{
              username: username
            }, {
              email: email
            }]
          });
        case 2:
          existingUser = _context.sent;
          if (!existingUser) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Username or Email already exists"
          }));
        case 3:
          // 🔐 Generate random password
          randomPassword = Math.random().toString(36).slice(-8);
          _context.next = 4;
          return bcrypt.hash(randomPassword, 10);
        case 4:
          hashedPassword = _context.sent;
          newStudent = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: "student"
          });
          _context.next = 5;
          return newStudent.save();
        case 5:
          _context.next = 6;
          return transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Student Account Credentials",
            html: "\n        <h3>Welcome to Job Portal</h3>\n        <p><strong>Username:</strong> ".concat(username, "</p>\n        <p><strong>Password:</strong> ").concat(randomPassword, "</p>\n        <p>Please login and change your password after first login.</p>\n      ")
          });
        case 6:
          res.status(201).json({
            success: true,
            message: "Student created & credentials sent"
          });
          _context.next = 9;
          break;
        case 7:
          _context.prev = 7;
          _t = _context["catch"](0);
          if (!(_t.code === 11000)) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Username or Email already exists"
          }));
        case 8:
          console.error("Create Student Error:", _t);
          res.status(500).json({
            success: false,
            message: "Something went wrong"
          });
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getStudents = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var students, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return User.find({
            role: "student"
          }).select("-password").sort({
            createdAt: -1
          });
        case 1:
          students = _context2.sent;
          res.status(200).json({
            success: true,
            students: students
          });
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          res.status(500).json({
            message: _t2.message
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

// ✅ Update Student
exports.updateStudent = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var id, _req$body2, username, email, password, student, hashedPassword, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _req$body2 = req.body, username = _req$body2.username, email = _req$body2.email, password = _req$body2.password;
          _context3.next = 1;
          return User.findById(id);
        case 1:
          student = _context3.sent;
          if (!(!student || student.role !== "student")) {
            _context3.next = 2;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));
        case 2:
          student.username = username || student.username;
          student.email = email || student.email;
          if (!password) {
            _context3.next = 4;
            break;
          }
          _context3.next = 3;
          return bcrypt.hash(password, 10);
        case 3:
          hashedPassword = _context3.sent;
          student.password = hashedPassword;
        case 4:
          _context3.next = 5;
          return student.save();
        case 5:
          res.status(200).json({
            success: true,
            message: "Student updated successfully"
          });
          _context3.next = 7;
          break;
        case 6:
          _context3.prev = 6;
          _t3 = _context3["catch"](0);
          res.status(500).json({
            message: _t3.message
          });
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 6]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// ✅ Delete Student
exports.deleteStudent = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var id, student, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 1;
          return User.findByIdAndDelete(id);
        case 1:
          student = _context4.sent;
          if (student) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));
        case 2:
          res.status(200).json({
            success: true,
            message: "Student deleted successfully"
          });
          _context4.next = 4;
          break;
        case 3:
          _context4.prev = 3;
          _t4 = _context4["catch"](0);
          res.status(500).json({
            message: _t4.message
          });
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();