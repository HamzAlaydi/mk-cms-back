const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const partnerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  founded: String,
  headquarters: String,
  employees: String,
  specialization: String,
  website: String,
  ceo: String,
  revenue: String,
}, { _id: false });

const partnerLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  year: { type: String, required: true },
  event: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const partnershipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  nextMilestone: String,
  status: { type: String, required: true, enum: ['active', 'inactive', 'completed', 'cancelled'] },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  partnerInformation: partnerInfoSchema,
  partnerLinks: [partnerLinkSchema],
  timeline: [timelineSchema],
  achievements: [achievementSchema],
  attachments: [fileSchema],
  website: String,
  contact: String,
  focusAreas: [{ type: String }],
  image: fileSchema,
  documents: [fileSchema],
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Partnership', partnershipSchema); 