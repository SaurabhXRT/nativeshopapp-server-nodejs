// routes/shopkeeper.js
const express = require('express');
const router = express.Router();
const Shopkeeper = require('../models/Shopkeeper');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware

// Get shopkeepers for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find({ createdBy: req.user._id });
    res.json(shopkeepers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new shopkeeper for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const newShopkeeper = new Shopkeeper({ name, createdBy: req.user._id });
    await newShopkeeper.save();
    res.status(201).json(newShopkeeper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
