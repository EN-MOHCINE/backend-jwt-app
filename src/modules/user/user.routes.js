const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');

// All routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.post('/avatar', uploadMiddleware.single('avatar'), userController.uploadAvatar);

// Admin routes (you can add role-based middleware here)
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
