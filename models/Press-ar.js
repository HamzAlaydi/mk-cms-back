const mongoose = require('mongoose');

const pressSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  content: { type: String, required: true }, // المحتوى
  author: { type: String, required: true }, // المؤلف
  publication: { type: String, required: true }, // النشر
  publishDate: { type: Date, required: true }, // تاريخ النشر
  url: { type: String }, // الرابط
  image: [{ type: String }], // الصور
  isActive: { type: Boolean, default: true }, // نشط
  tags: [{ type: String }], // العلامات
  category: { type: String, enum: ['أخبار', 'مقابلة', 'ميزة', 'مراجعة', 'إعلان'] }, // الفئة
  youtubeLinks: [{ type: String }], // روابط يوتيوب
  documents: [{ type: String }], // المستندات
  relatedArticles: [{ type: String }], // المقالات ذات الصلة
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Press-ar', pressSchema);
