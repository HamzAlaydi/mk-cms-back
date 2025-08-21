const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	url: { type: String, required: true },
	name: String,
	type: String,
	size: Number,
	uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const companySchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	summary: { type: String, required: true, trim: true },
	description: { type: String, required: true },
	website: { type: String },
	established: { type: Date },
	isActive: { type: Boolean, default: true },
	order: { type: Number, default: 0 },
	logo: fileSchema,
	lang: { type: String, enum: ['en', 'ar'], default: 'en', index: true },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);


