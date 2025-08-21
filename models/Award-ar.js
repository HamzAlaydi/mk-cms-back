const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  description: { type: String, required: true }, // الوصف
  awardingBody: { type: String, required: true }, // الجهة المانحة
  awardDate: { type: Date, required: true }, // تاريخ الجائزة
  category: { type: String, required: true, enum: ['التميز', 'الابتكار', 'الجودة', 'الاستدامة', 'القيادة', 'الاعتراف الصناعي'] }, // الفئة
  level: { type: String, required: true, enum: ['محلي', 'وطني', 'إقليمي', 'دولي', 'عالمي'] }, // المستوى
  features: [{ type: String }], // المميزات
  image: fileSchema, // الصورة
  documents: [fileSchema], // المستندات
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Award-ar', awardSchema);
