module.exports = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-token-secret',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
};
