const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Bước 1: Lấy token từ header
  const authHeader = req.headers["authorization"];

  // Header format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Lấy phần sau "Bearer "

  // Bước 2: Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn user info vào request để dùng trong route
    next(); // Token hợp lệ → cho phép đi tiếp
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware