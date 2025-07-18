const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  budget: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'] },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'urgent'] },
  successPartner: { type: String },
  images: [fileSchema],
  videos: [fileSchema],
  documents: [fileSchema],
  keyMetrics: [{ type: String }],
  awards: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 