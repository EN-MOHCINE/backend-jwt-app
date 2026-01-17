const { pool } = require("../config/db");
const { errorResponse } = require("../utils/response");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // req.user should be set by your auth middleware (decoded JWT)
      const userId = req.user.id;

      // Get user's role
      const [users] = await pool.execute(
        `SELECT r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return errorResponse(res, 404, "User not found");
      }

      const userRole = users[0].role;
      if (!roles.includes(userRole)) {
        return errorResponse(res, 403, "Access denied");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = checkRole;
