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