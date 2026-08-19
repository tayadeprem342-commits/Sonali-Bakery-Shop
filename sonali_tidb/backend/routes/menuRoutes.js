const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

// public — anyone can browse the menu
router.get('/', getMenu);

// admin only — manage menu items
router.post('/', protect, addMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);
router.patch('/:id/toggle', protect, toggleAvailability);

module.exports = router;
