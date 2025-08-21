const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['صورة', 'فيديو', 'مستند'] }, // النوع
  url: { type: String, required: true }, // الرابط
  title: { type: String, required: true }, // العنوان
  description: String, // الوصف
}, { _id: false });

const partnerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true }, // الاسم
  founded: String, // تاريخ التأسيس
  headquarters: String, // المقر الرئيسي
  employees: String, // الموظفون
  specialization: String, // التخصص
  website: String, // الموقع الإلكتروني
  ceo: String, // الرئيس التنفيذي
  revenue: String, // الإيرادات
}, { _id: false });

const partnerLinkSchema = new mongoose.Schema({
  title: { type: String, required: true }, // العنوان
  url: { type: String, required: true }, // الرابط
  type: { type: String, required: true, enum: ['موقع', 'صحافة', 'بحث', 'دراسة حالة'] }, // النوع
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  year: { type: String, required: true }, // السنة
  event: { type: String, required: true }, // الحدث
  description: { type: String, required: true }, // الوصف
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true }, // العنوان
  description: { type: String, required: true }, // الوصف
}, { _id: false });

const partnershipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  description: { type: String, required: true }, // الوصف
  startDate: { type: Date, required: true }, // تاريخ البدء
  nextMilestone: String, // المعلم التالي
  status: { type: String, required: true, enum: ['نشط', 'غير نشط', 'مكتمل', 'ملغي'] }, // الحالة
  priority: { type: String, required: true, enum: ['منخفض', 'متوسط', 'عالي'] }, // الأولوية
  image: fileSchema, // الصورة
  partnerInformation: partnerInfoSchema, // معلومات الشريك
  partnerLinks: [partnerLinkSchema], // روابط الشريك
  timeline: [timelineSchema], // الجدول الزمني
  achievements: [achievementSchema], // الإنجازات
  attachments: [attachmentSchema], // المرفقات
  youtubeLinks: [{ type: String }], // روابط يوتيوب
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Partnership-ar', partnershipSchema);
