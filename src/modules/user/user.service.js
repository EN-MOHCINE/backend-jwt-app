const { pool } = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/hash');

const getUserById = async (id) => {
  const [users] = await pool.execute(
    'SELECT id, username, email, avatar, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );

  if (users.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return users[0];
};

const getAllUsers = async () => {
  const [users] = await pool.execute(
    'SELECT id, username, email, avatar, created_at, updated_at FROM users'
  );
  return users;
};

const updateUser = async (id, { username, email }) => {
  // Check if email is already taken by another user
  if (email) {
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingUsers.length > 0) {
      const error = new Error('Email is already taken');
      error.statusCode = 409;
      throw error;
    }
  }

  const updates = [];
  const values = [];

  if (username) {
    updates.push('username = ?');
    values.push(username);
  }
  if (email) {
    updates.push('email = ?');
    values.push(email);
  }

  if (updates.length === 0) {
    const error = new Error('No fields to update');
    error.statusCode = 400;
    throw error;
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  await pool.execute(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  return getUserById(id);
};

const changePassword = async (id, currentPassword, newPassword) => {
  // Get current password hash
  const [users] = await pool.execute(
    'SELECT password FROM users WHERE id = ?',
    [id]
  );

  if (users.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify current password
  const isValid = await comparePassword(currentPassword, users[0].password);
  if (!isValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword);
  await pool.execute(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
    [hashedPassword, id]
  );
};

const updateAvatar = async (id, filename) => {
  await pool.execute(
    'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
    [filename, id]
  );

  return { avatar: filename };
};

const deleteUser = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  updateUser,
  changePassword,
  updateAvatar,
  deleteUser
};
