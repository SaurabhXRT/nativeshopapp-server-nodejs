// routes/shopkeeper.js
const express = require('express');
const router = express.Router();
const Shopkeeper = require('../models/ShopKeeper');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware
//const Shopkeeper = require('../models/Shopkeeper');
const ListItem = require('../models/ListItem');

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

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const shopkeeper = await Shopkeeper.findByIdAndDelete(req.params.id);

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    res.status(200).json({ message: 'Shopkeeper deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:shopkeeperId/items', authMiddleware, async (req, res) => {
  try {
    const items = await ListItem.find({ shopkeeper: req.params.shopkeeperId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new item for a specific shopkeeper
router.post('/:shopkeeperId/items', authMiddleware, async (req, res) => {
  try {
    const { itemName, price } = req.body;
    const shopkeeperId = req.params.shopkeeperId;

    const newItem = new ListItem({
      shopkeeper: shopkeeperId,
      itemName,
      price,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:shopkeeperId/items/:itemId', authMiddleware, async (req, res) => {
  const { shopkeeperId, itemId } = req.params;

  try {
    const shopkeeper = await Shopkeeper.findOne({ _id: shopkeeperId });

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Find the index of the item to be removed
    const itemIndex = shopkeeper.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Remove the item from the items array
    shopkeeper.items.splice(itemIndex, 1);

    // Save the updated shopkeeper document
    await shopkeeper.save();

    res.json({ message: 'Item deleted successfully', deletedItemId: itemId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
