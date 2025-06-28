const userService = require('../services/user');

// PUBLIC_INTERFACE
async function register(req, res) {
  /** Register a new user */
  try {
    const { username, password } = req.body;
    const user = userService.createUser(username, password);
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// PUBLIC_INTERFACE
async function login(req, res) {
  /** Login an existing user, return JWT token */
  try {
    const { username, password } = req.body;
    const token = userService.authenticateUser(username, password);
    return res.json({ token });
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
}

// PUBLIC_INTERFACE
async function getProfile(req, res) {
  /** Get the current user's profile (id and username) */
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const safeUser = userService.getUserSafe(req.user.username);
  return res.json({ user: safeUser });
}

module.exports = { register, login, getProfile };
