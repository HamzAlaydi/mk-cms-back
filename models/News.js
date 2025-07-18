const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publishDate: { type: Date, required: true },
  source: { type: String },
  tags: [{ type: String }],
  image: fileSchema,
  documents: [fileSchema],
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema); 