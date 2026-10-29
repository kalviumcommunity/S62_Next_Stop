const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "Access Denied: No token provided" });

  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "Access Denied: Invalid token format" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Access Denied: Invalid token" });
  }
};
