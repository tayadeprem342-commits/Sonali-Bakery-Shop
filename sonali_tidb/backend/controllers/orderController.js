const Order = require('../models/Order');
const generateOrderId = require('../utils/generateOrderId');
const { getIO } = require('../config/socket');
const { notifyOwner, confirmOrderToCustomer, notifyStatusUpdate } = require('../services/whatsappService');

const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, address, items, subtotal, gstAmount, deliveryFee, totalPrice, paymentMethod, notes } = req.body;
    if (!items || items.length === 0) { res.status(400); throw new Error('Order must contain at least one item'); }

    const orderId = generateOrderId();
    const order = await Order.create({ orderId, customerName, phone, address, items, subtotal, gstAmount, deliveryFee, totalPrice, paymentMethod, notes });

    getIO().emit('newOrder', order);
    notifyOwner(order);
    confirmOrderToCustomer(order);

    res.status(201).json(order);
  } catch (error) { next(error); }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByOrderId(req.params.orderId);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    res.status(200).json(order);
  } catch (error) { next(error); }
};

const acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.updateStatus(req.params.id, 'accepted');
    if (!order) { res.status(404); throw new Error('Order not found'); }
    getIO().emit('orderAccepted', order);
    notifyStatusUpdate(order);
    res.status(200).json(order);
  } catch (error) { next(error); }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.updateStatus(req.params.id, 'cancelled');
    if (!order) { res.status(404); throw new Error('Order not found'); }
    getIO().emit('orderCancelled', order);
    notifyStatusUpdate(order);
    res.status(200).json(order);
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['pending','accepted','preparing','out_for_delivery','delivered','cancelled'];
    if (!valid.includes(status)) { res.status(400); throw new Error('Invalid status value'); }

    const order = await Order.updateStatus(req.params.id, status);
    if (!order) { res.status(404); throw new Error('Order not found'); }

    getIO().emit('orderUpdated', order);
    notifyStatusUpdate(order);
    res.status(200).json(order);
  } catch (error) { next(error); }
};

const clearAllOrders = async (req, res, next) => {
  try {
    await Order.deleteAll();
    getIO().emit('ordersCleared');
    res.status(200).json({ message: 'All order history cleared' });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getOrders, getOrderById, acceptOrder, cancelOrder, updateOrderStatus, clearAllOrders };
