const express = require('express');
const router = express.Router();
const { loginAdmin, createAdmin, getAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// public login
router.post('/login', loginAdmin);

// one-time setup to create the first admin account
router.post('/setup', createAdmin);

// get current admin info (protected)
router.get('/profile', protect, getAdminProfile);

module.exports = router;
