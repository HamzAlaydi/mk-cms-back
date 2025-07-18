const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  issuingBody: { type: String, required: true },
  issueDate: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  category: { type: String, required: true, enum: ['Quality', 'Environmental', 'Organic', 'Food Safety', 'Accreditation', 'National'] },
  features: [{ type: String }],
  image: fileSchema,
  documents: [fileSchema],
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema); 