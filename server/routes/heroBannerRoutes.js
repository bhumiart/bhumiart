const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/HeroBanner');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all hero banners
// @route   GET /api/hero-banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const banners = await HeroBanner.find({}).sort('order');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new hero banner
// @route   POST /api/hero-banners
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { image, title, subtitle, link, order } = req.body;
    const banner = new HeroBanner({
      image,
      title,
      subtitle,
      link,
      order: order || 0,
    });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a hero banner
// @route   DELETE /api/hero-banners/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Hero banner removed' });
    } else {
      res.status(404).json({ message: 'Hero banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a hero banner
// @route   PUT /api/hero-banners/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { image, title, subtitle, link, order } = req.body;
    const banner = await HeroBanner.findById(req.params.id);
    if (banner) {
      banner.image = image || banner.image;
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      banner.link = link || banner.link;
      banner.order = order !== undefined ? order : banner.order;
      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Hero banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
