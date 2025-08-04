const mongoose = require('mongoose');

const pressSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publication: { type: String, required: true },
  publishDate: { type: Date, required: true },
  url: { type: String },
  image: [{ type: String }],
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  category: { type: String, enum: ['news', 'interview', 'feature', 'review', 'announcement'] },
  youtubeLinks: [{ type: String }],
  documents: [{ type: String }],
  relatedArticles: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Press', pressSchema); 