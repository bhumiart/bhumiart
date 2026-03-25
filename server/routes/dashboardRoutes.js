const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    // Calculate total sales from all orders except cancelled
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Get recent orders (last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // Calculate growth (simple example: orders this month vs last month)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = await Order.countDocuments({
      status: { $ne: 'Cancelled' },
      createdAt: { $gte: thisMonthStart }
    });
    const lastMonthOrders = await Order.countDocuments({
      status: { $ne: 'Cancelled' },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    let growth = 0;
    if (lastMonthOrders > 0) {
      growth = ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
    } else if (thisMonthOrders > 0) {
      growth = 100;
    }

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSales,
      recentOrders,
      growth: growth.toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
