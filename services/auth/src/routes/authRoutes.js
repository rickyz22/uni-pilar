const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.registerValidation, authController.register);

// POST /api/auth/login
router.post('/login', authController.loginValidation, authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// GET /api/auth/me (protected)
router.get('/me', authMiddleware, authController.me);

module.exports = router;
