const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	url: { type: String, required: true },
	name: String,
	type: String,
	size: Number,
	uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const companySchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true }, // الاسم
	summary: { type: String, required: true, trim: true }, // الملخص
	description: { type: String, required: true }, // الوصف
	website: { type: String }, // الموقع الإلكتروني
	established: { type: Date }, // تاريخ التأسيس
	isActive: { type: Boolean, default: true }, // نشط
	order: { type: Number, default: 0 }, // ترتيب العرض
	logo: fileSchema, // الشعار
	lang: { type: String, enum: ['en', 'ar'], default: 'ar', index: true }, // اللغة
}, { timestamps: true });

module.exports = mongoose.model('Company-ar', companySchema);


