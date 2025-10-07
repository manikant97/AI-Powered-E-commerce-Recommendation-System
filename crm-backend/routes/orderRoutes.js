const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(auth);

// Create a new order
router.post('/', controller.createOrder);

// Get all orders for the authenticated user
router.get('/', controller.getUserOrders);

// Get a specific order by ID
router.get('/:id', controller.getOrderById);

// Update order status
router.patch('/:id/status', controller.updateOrderStatus);

// Get order statistics
router.get('/stats/summary', controller.getOrderStats);

module.exports = router; 