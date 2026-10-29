const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  caption: { type: String, maxlength: 200, default: '' },
  imageUrl: { type: String, required: [true, 'Image URL is required'] },
  notes: { type: String, maxlength: 1000, default: '' },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Memory', MemorySchema);
