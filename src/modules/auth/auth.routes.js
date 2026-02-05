const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { apiLimiter , authLimiter , createAccountLimiter } = require('../../middlewares/rateLimit.middleware');

// Public routes
router.post('/register' , createAccountLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh-token' , authLimiter, authController.refreshToken);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
