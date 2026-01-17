const userService = require('./user.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return successResponse(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const result = await userService.updateUser(req.user.id, { username, email });
    return successResponse(res, 200, 'Profile updated successfully', result);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      throw error;
    }
    const result = await userService.updateAvatar(req.user.id, req.file.filename);
    return successResponse(res, 200, 'Avatar uploaded successfully', result);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getAllUsers,
  deleteUser
};
