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
});

module.exports = mongoose.model('Shopkeeper', shopkeeperSchema);
