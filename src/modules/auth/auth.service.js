const { pool } = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../../utils/token');

const register = async ({ username, email, password }) => {
  // Check if user already exists
  const [existingUsers] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  return { userId: result.insertId };
};

const login = async ({ email, password }) => {
  // Find user
  const [users] = await pool.execute(
    'SELECT id, username, email, password FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  // Store refresh token in database
  await pool.execute(
    'UPDATE users SET refresh_token = ? WHERE id = ?',
    [refreshToken, user.id]
  );

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token) => {
  const jwt = require('jsonwebtoken');
  const jwtConfig = require('../../config/jwt');
  
  try {
    const decoded = jwt.verify(token, jwtConfig.refreshTokenSecret);
    
    // Verify token exists in database
    const [users] = await pool.execute(
      'SELECT id, email FROM users WHERE id = ? AND refresh_token = ?',
      [decoded.id, token]
    );

    if (users.length === 0) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    const user = users[0];
    const accessToken = generateAccessToken({ id: user.id, email: user.email });

    return { accessToken };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }
    throw error;
  }
};

const logout = async (userId) => {
  await pool.execute(
    'UPDATE users SET refresh_token = NULL WHERE id = ?',
    [userId]
  );
};

module.exports = {
  register,
  login,
  refreshToken,
  logout
};
