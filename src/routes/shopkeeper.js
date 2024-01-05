const express = require('express');
const router = express.Router();
const Shopkeeper = require('../models/ShopKeeper');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware
//const Shopkeeper = require('../models/Shopkeeper');
const ListItem = require('../models/ListItem');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find({ createdBy: req.user._id });
    res.json(shopkeepers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

router.get('/:id/name', authMiddleware, async (req, res) => {
  try {
    const shopkeeper = await Shopkeeper.findById(req.params.id);

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    res.status(200).json({ name: shopkeeper.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:shopkeeperId/items', authMiddleware, async (req, res) => {
  try {
    //const shopkeepername = await Shopkeeper.find(req.params.id);
    const items = await ListItem.find({ shopkeeper: req.params.shopkeeperId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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
   const item = await ListItem.findByIdAndDelete(itemId);
   if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully', deletedItemId: itemId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
