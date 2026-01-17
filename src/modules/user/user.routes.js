const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');
const checkRole = require('../../middlewares/role.middleware');
const checkPermission = require('../../middlewares/permission.middleware');
// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', checkPermission('view_profile1'),  userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.post('/avatar', uploadMiddleware.single('avatar'), userController.uploadAvatar);

// Admin routes (you can add role-based middleware here)
router.get('/all-users', checkRole(['admin1']), userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
