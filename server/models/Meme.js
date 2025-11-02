const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    default: 'Anon'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  }
});

// Index para melhorar performance de queries
memeSchema.index({ likes: -1 });
memeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Meme', memeSchema);
