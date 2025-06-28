const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // In-memory user store

const JWT_SECRET = process.env.JWT_SECRET || 'noteease_secret'; // Should use .env for production

// PUBLIC_INTERFACE
function createUser(username, password) {
  /** Create a new user with hashed password. Returns user object (without password). */
  if (!username || !password) throw new Error('Username and password required');
  if (users.some(u => u.username === username)) throw new Error('User already exists');
  
  const hashed = bcrypt.hashSync(password, 10);
  const user = { id: users.length + 1, username, password: hashed };
  users.push(user);
  // Return safe user object (no password)
  return { id: user.id, username: user.username };
}

// PUBLIC_INTERFACE
function authenticateUser(username, password) {
  /** Authenticate user with username/password. Returns JWT if valid. */
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('Invalid credentials');
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verify JWT and return user claims. Throws if auth fails. */
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new Error('Invalid or expired token');
  }
}

// PUBLIC_INTERFACE
function getUserSafe(username) {
  /** Get safe user info without password */
  const user = users.find(u => u.username === username);
  if (!user) return null;
  return { id: user.id, username: user.username };
}

module.exports = {
  createUser,
  authenticateUser,
  verifyToken,
  getUserSafe,
};
