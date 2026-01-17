const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Generate an access token
 * @param {Object} payload - Token payload
 * @returns {string} Access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry
  });
};

/**
 * Generate a refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry
  });
};

/**
 * Verify an access token
 * @param {string} token - Access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessTokenSecret);
};

/**
 * Verify a refresh token
 * @param {string} token - Refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
