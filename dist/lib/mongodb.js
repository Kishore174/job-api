"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var mongoose = require("mongoose");
var MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}
var cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}
function connectDB() {
  return _connectDB.apply(this, arguments);
}
function _connectDB() {
  _connectDB = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!cached.conn) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", cached.conn);
        case 1:
          if (!cached.promise) {
            cached.promise = mongoose.connect(MONGO_URI).then(function (mongoose) {
              return mongoose;
            });
          }
          _context.next = 2;
          return cached.promise;
        case 2:
          cached.conn = _context.sent;
          return _context.abrupt("return", cached.conn);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _connectDB.apply(this, arguments);
}
module.exports = connectDB;