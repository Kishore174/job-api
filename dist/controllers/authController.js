"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// src/controllers/authController.js
var User = require('../module/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
exports.register = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, username, email, password, role, existingUser, hashedPassword, newUser, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, role = _req$body.role;
          if (!(!username || !email || !password)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'All fields required'
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
            message: 'User already exists'
          }));
        case 3:
          _context.next = 4;
          return bcrypt.hash(password, 10);
        case 4:
          hashedPassword = _context.sent;
          newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role
          });
          _context.next = 5;
          return newUser.save();
        case 5:
          res.status(201).json({
            success: true,
            message: 'User registered successfully'
          });
          _context.next = 7;
          break;
        case 6:
          _context.prev = 6;
          _t = _context["catch"](0);
          console.error(_t);
          res.status(500).json({
            success: false,
            message: 'Registration failed'
          });
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body2, username, password, user, isMatch, token, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 1;
          return User.findOne({
            username: username
          });
        case 1:
          user = _context2.sent;
          if (user) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid credentials'
          }));
        case 2:
          _context2.next = 3;
          return bcrypt.compare(password, user.password);
        case 3:
          isMatch = _context2.sent;
          if (isMatch) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid credentials'
          }));
        case 4:
          token = jwt.sign({
            id: user._id,
            role: user.role
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          res.status(200).json({
            success: true,
            token: token,
            role: user.role
          });
          _context2.next = 6;
          break;
        case 5:
          _context2.prev = 5;
          _t2 = _context2["catch"](0);
          console.error('Login error:', _t2.message);
          res.status(500).json({
            success: false,
            message: 'Login failed'
          });
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 5]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getDashboardData = function (req, res) {
  res.status(501).json({
    message: 'Not Implemented'
  });
};