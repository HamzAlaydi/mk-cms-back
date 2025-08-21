const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const careerSchema = new mongoose.Schema({
  translationGroupId: { type: String, index: true }, // معرّف المجموعة للترجمة
  title: { type: String, required: true, trim: true }, // العنوان
  summary: { type: String, required: true, trim: true }, // الملخص
  description: { type: String, required: true }, // الوصف
  department: { type: String, required: true, enum: ['الهندسة', 'المبيعات', 'التسويق', 'العمليات', 'المالية', 'الموارد البشرية', 'تقنية المعلومات', 'البحث والتطوير', 'ضمان الجودة', 'سلسلة التوريد'] }, // القسم
  location: { type: String, required: true }, // الموقع
  type: { type: String, required: true, enum: ['دوام كامل', 'دوام جزئي', 'عقد', 'تدريب', 'عن بُعد'] }, // النوع
  experience: { type: String, required: true, enum: ['جديد', 'مبتدئ متقدم', 'متوسط', 'خبير', 'تنفيذي'] }, // الخبرة
  requirements: [{ type: String }], // المتطلبات
  responsibilities: [{ type: String }], // المسؤوليات
  benefits: [{ type: String }], // المزايا
  salary: {
    min: { type: Number }, // الحد الأدنى
    max: { type: Number }, // الحد الأقصى
    currency: { type: String, default: 'USD' } // العملة
  },
  isActive: { type: Boolean, default: true }, // نشط
  applicationDeadline: { type: Date }, // موعد انتهاء التقديم
  image: fileSchema, // الصورة
  lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Career-ar', careerSchema);
