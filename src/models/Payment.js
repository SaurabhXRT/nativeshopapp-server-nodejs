// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeeper',
    required: true,
  },
  paidPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
