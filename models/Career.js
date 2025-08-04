const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  department: { type: String, required: true, enum: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'IT', 'Research & Development', 'Quality Assurance', 'Supply Chain'] },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] },
  experience: { type: String, required: true, enum: ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Executive'] },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  benefits: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  isActive: { type: Boolean, default: true },
  applicationDeadline: { type: Date },
  image: fileSchema,
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema); 