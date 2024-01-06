// models/Shopkeeper.js
const mongoose = require('mongoose');

const shopkeeperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Shopkeeper', shopkeeperSchema);
