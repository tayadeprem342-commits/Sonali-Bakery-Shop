const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  acceptOrder,
  cancelOrder,
  updateOrderStatus,
  clearAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// public — customer places an order
router.post('/', createOrder);

// admin only — view and manage orders
router.get('/', protect, getOrders);
router.delete('/clear', protect, clearAllOrders); // must come before '/:orderId'
router.get('/:orderId', getOrderById); // customer can track by orderId
router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
