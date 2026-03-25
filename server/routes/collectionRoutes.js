const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a collection
// @route   POST /api/collections
// @access  Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const collectionExists = await Collection.findOne({ title });

    if (collectionExists) {
      return res.status(400).json({ message: 'Collection already exists' });
    }

    const collection = await Collection.create({ title, image, description });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (collection) {
      collection.title = title || collection.title;
      collection.image = image || collection.image;
      collection.description = description || collection.description;
      const updatedCollection = await collection.save();
      res.json(updatedCollection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (collection) {
      await collection.deleteOne();
      res.json({ message: 'Collection removed' });
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
