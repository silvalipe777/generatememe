const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalMemes: {
    type: Number,
    default: 0
  },
  totalVisitors: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stats', statsSchema);
