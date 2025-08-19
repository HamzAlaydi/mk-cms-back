const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema locally for testing
const candidateResumeSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  cvFile: {
    url: { type: String, required: true },
    name: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const CandidateResume = mongoose.model('CandidateResume', candidateResumeSchema);

async function testSchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for testing');

    // Test data
    const testData = {
      jobId: new mongoose.Types.ObjectId(),
      jobTitle: 'Test Job',
      applicantName: 'Test Applicant',
      cvFile: {
        url: 'https://example.com/test.pdf',
        name: 'test.pdf',
        mimeType: 'application/pdf',
        size: 12345
      }
    };

    console.log('Test data:', testData);

    // Create instance
    const candidateResume = new CandidateResume(testData);
    console.log('Instance created successfully');

    // Validate
    const validationError = candidateResume.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
    } else {
      console.log('Validation passed');
    }

    // Try to save
    await candidateResume.save();
    console.log('Save successful');

    // Clean up
    await CandidateResume.findByIdAndDelete(candidateResume._id);
    console.log('Test data cleaned up');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

testSchema();
