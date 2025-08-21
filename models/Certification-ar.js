const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  description: { type: String, required: true }, // الوصف
  issuingBody: { type: String, required: true }, // الجهة المصدرة
  issueDate: { type: Date, required: true }, // تاريخ الإصدار
  validUntil: { type: Date, required: true }, // صالح حتى
  priority: { type: String, required: true, enum: ['منخفض', 'متوسط', 'عالي'] }, // الأولوية
  category: { type: String, required: true, enum: ['الجودة', 'البيئة', 'العضوي', 'سلامة الغذاء', 'الاعتماد', 'الوطني'] }, // الفئة
  features: [{ type: String }], // المميزات
  image: fileSchema, // الصورة
  documents: [fileSchema], // المستندات
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Certification-ar', certificationSchema);
