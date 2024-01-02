const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Payment = require('../models/Payment');
const Shopkeeper = require('../models/ShopKeeper');

router.post('/:shopkeeperId/payments', authMiddleware, async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    const { paidPrice } = req.body;

    const payment = new Payment({
      shopkeeper: shopkeeperId,
      paidPrice,
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:shopkeeperId/payments', async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    const shopkeeper = await Shopkeeper.findById(shopkeeperId);
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }
    const payments = await Payment.find({ shopkeeper: shopkeeperId });
    console.log(payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
