const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// Validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('legajo')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Legajo must be between 3 and 20 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail(),
  body('legajo')
    .optional()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Helper: Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
exports.register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { name, email, legajo, password, careerId, year, turno } = req.body;

    // Check if email or legajo already exists
    const exists = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ email }, { legajo }] 
      } 
    });
    
    if (exists) {
      return res.status(409).json({ 
        error: 'Email or legajo already registered' 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      legajo, 
      password: hashed,
      careerId,
      year,
      turno,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(201).json({ 
      token: accessToken,
      refreshToken,
      user: { 
        id: user.id, 
        name, 
        email, 
        legajo,
        careerId,
        year,
        turno,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { email, legajo, password } = req.body;

    // Find user by email or legajo
    const user = await User.scope('withPassword').findOne({
      where: email ? { email } : { legajo },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    return res.json({ 
      token: accessToken,
      refreshToken,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        legajo: user.legajo,
        careerId: user.careerId,
        year: user.year,
        turno: user.turno,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return res.json({ 
      token: accessToken,
      refreshToken: newRefreshToken 
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Refresh token expired',
        code: 'REFRESH_EXPIRED'
      });
    }
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get user' });
  }
};
