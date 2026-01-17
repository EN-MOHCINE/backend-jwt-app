const { pool } = require('../config/db');
const { errorResponse } = require('../utils/response');

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    // Get user's permissions via their role
    const [permissions] = await pool.execute(
      `SELECT p.name FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN role_permissions rp ON r.id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ? AND p.name = ?`,
      [userId, permissionName]
    );

    if (permissions.length === 0) {
      return errorResponse(res, 403, 'Access denied');
    }

    next();
  };
};

module.exports = checkPermission;