const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Mixed schema to handle both string URLs and file objects
const mixedFileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  description: { type: String, required: true }, // الوصف
  budget: { type: String }, // الميزانية
  location: { type: String, required: true }, // الموقع
  area: { type: String, required: true }, // المنطقة
  startDate: { type: Date, required: true }, // تاريخ البدء
  endDate: { type: Date, required: true }, // تاريخ الانتهاء
  status: { type: String, required: true, enum: ['تخطيط', 'قيد التنفيذ', 'مكتمل', 'معلق', 'ملغي'] }, // الحالة
  priority: { type: String, enum: ['منخفض', 'متوسط', 'عالي', 'عاجل'] }, // الأولوية
  successPartner: { type: String }, // شريك النجاح
  youtubeLinks: [{ type: String }], // روابط يوتيوب
  images: [{ type: mongoose.Schema.Types.Mixed }], // الصور
  videos: [{ type: mongoose.Schema.Types.Mixed }], // الفيديوهات
  documents: [{ type: mongoose.Schema.Types.Mixed }], // المستندات
  keyMetrics: [{ type: String }], // المقاييس الرئيسية
  awards: [{ type: String }], // الجوائز
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Project-ar', projectSchema);
