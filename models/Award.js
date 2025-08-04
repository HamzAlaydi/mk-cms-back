const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  awardingBody: { type: String, required: true },
  awardDate: { type: Date, required: true },
  category: { type: String, required: true, enum: ['Excellence', 'Innovation', 'Quality', 'Sustainability', 'Leadership', 'Industry Recognition'] },
  level: { type: String, required: true, enum: ['Local', 'National', 'Regional', 'International', 'Global'] },
  features: [{ type: String }],
  image: fileSchema,
  documents: [fileSchema],
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema); 