const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  content: { type: String, required: true }, // المحتوى
  author: { type: String, required: true }, // المؤلف
  publishDate: { type: Date, required: true }, // تاريخ النشر
  source: { type: String }, // المصدر
  tags: [{ type: String }], // العلامات
  image: fileSchema, // الصورة
  documents: [fileSchema], // المستندات
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('News-ar', newsSchema);
