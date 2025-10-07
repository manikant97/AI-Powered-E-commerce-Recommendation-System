const Order = require('../models/Order');
const User = require('../models/User');

// Create a new order
async function createOrder(req, res) {
  try {
    const { items, shippingAddress, shippingMethod, paymentMethod, subtotal, shippingCost, total } = req.body;
    
    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Create order with user ID
    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      shippingCost,
      total
    });

    await order.save();
    
    // Populate product details for response
    await order.populate('items.product');
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get all orders for the authenticated user
async function getUserOrders(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error getting user orders:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get a specific order by ID
async function getOrderById(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error getting order:', err);
    res.status(500).json({ error: err.message });
  }
}

// Update order status (for admin use)
async function updateOrderStatus(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get order statistics for the user
async function getOrderStats(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const stats = await Order.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    res.json(stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 });
  } catch (err) {
    console.error('Error getting order stats:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
}; 