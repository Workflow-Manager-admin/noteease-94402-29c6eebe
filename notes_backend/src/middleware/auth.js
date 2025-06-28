// Authentication middleware for protecting routes

const { verifyToken } = require('../services/user');

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Express middleware that checks for valid JWT token in Authorization header. */
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Malformed Authorization header' });
  }
  try {
    const user = verifyToken(parts[1]);
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: (e && e.message) || 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
