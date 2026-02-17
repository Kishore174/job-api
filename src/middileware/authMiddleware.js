const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    console.log("🔹 Incoming Authorization Header:", req.headers['authorization']);

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("❌ JWT Verify Error:", err.message);
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      console.log("✅ Decoded Token:", decoded);
      console.log("🔹 Required Roles:", roles);
      console.log("🔹 User Role:", decoded.role);

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        console.log("❌ Role not allowed");
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      console.log("✅ Role allowed");
      next();
    });
  };
};

module.exports = authMiddleware;
