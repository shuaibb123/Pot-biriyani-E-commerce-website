// authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "134124124121112"; // Use environment variables for production

const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded; // Save decoded token payload in req.user
    next();
  });
};

module.exports = authenticateUser;
