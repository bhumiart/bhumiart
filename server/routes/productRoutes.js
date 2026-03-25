const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create product
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, originalPrice, image, countInStock } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      originalPrice,
      image,
      countInStock,
      rating: 0,
      numReviews: 0
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

// Update product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, originalPrice, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.originalPrice = originalPrice || product.originalPrice;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

// Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
