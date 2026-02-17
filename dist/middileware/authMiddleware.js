"use strict";

var jwt = require('jsonwebtoken');
var authMiddleware = function authMiddleware() {
  var roles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (req, res, next) {
    var _req$headers$authoriz;
    console.log("🔹 Incoming Authorization Header:", req.headers['authorization']);
    var token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1];
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log("❌ JWT Verify Error:", err.message);
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
      console.log("✅ Decoded Token:", decoded);
      console.log("🔹 Required Roles:", roles);
      console.log("🔹 User Role:", decoded.role);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        console.log("❌ Role not allowed");
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
      console.log("✅ Role allowed");
      next();
    });
  };
};
module.exports = authMiddleware;