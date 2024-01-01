// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Payment = require('../models/Payment');

// Save a new payment
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

module.exports = router;
